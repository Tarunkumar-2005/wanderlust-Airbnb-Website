const Listing = require('../models/listing.js');

// Geocoding helper using OpenStreetMap Nominatim API
async function geocodeLocation(location, country) {
  try {
    const query = encodeURIComponent(`${location}, ${country}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'User-Agent': 'StayWander-AirbnbClone/1.0' }
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    }
  } catch (err) {
    console.warn("Geocoding failed, location set without exact coordinates:", err.message);
  }
  return null;
}

module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (category && category.trim() !== "") {
    filter.category = category.trim();
  }

  if (q && q.trim() !== "") {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { description: searchRegex }
    ];
  }

  const allListings = await Listing.find(filter);
  res.render('listings/index.ejs', {
    allListings,
    searchQuery: q ? q.trim() : "",
    activeCategory: category ? category.trim() : ""
  });
};

module.exports.renderDashboard = async (req, res) => {
  const { q, category } = req.query;
  const userId = req.user._id;

  const totalListings = await Listing.countDocuments();
  const userListingsCount = await Listing.countDocuments({ owner: userId });
  const categoriesList = await Listing.distinct("category");

  let filter = { owner: userId };

  if (category && category.trim() !== "") {
    filter.category = category.trim();
  }

  if (q && q.trim() !== "") {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { description: searchRegex }
    ];
  }

  const myListings = await Listing.find(filter);

  res.render('listings/dashboard.ejs', {
    totalListings,
    userListingsCount,
    categoriesCount: categoriesList.length,
    myListings,
    searchQuery: q ? q.trim() : "",
    activeCategory: category ? category.trim() : ""
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!list) {
    req.flash("error", "Cannot find that listing");
    return res.redirect('/listings');
  }
  res.render("listings/show.ejs", { list });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";
  let listingData = req.body.Listing;

  let newlisting = new Listing(listingData);
  newlisting.owner = req.user._id;
  if (url && filename) {
    newlisting.image.url = url;
    newlisting.image.filename = filename;
  }

  // Handle geometry if provided or geocode
  if (req.body.lat && req.body.lng) {
    newlisting.geometry = {
      lat: parseFloat(req.body.lat),
      lng: parseFloat(req.body.lng)
    };
  } else if (newlisting.location && newlisting.country) {
    const geo = await geocodeLocation(newlisting.location, newlisting.country);
    if (geo) {
      newlisting.geometry = geo;
    }
  }

  await newlisting.save();
  req.flash("success", "New listing created successfully!");
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Cannot find that listing");
    return res.redirect('/listings');
  }
  let originalImageUrl = list.image ? list.image.url : "";
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250/");
  }
  res.render('listings/edit.ejs', { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listingData = req.body.Listing;
  let listing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  if (req.body.lat && req.body.lng) {
    listing.geometry = {
      lat: parseFloat(req.body.lat),
      lng: parseFloat(req.body.lng)
    };
  } else if (listing.location && listing.country && (!listing.geometry || !listing.geometry.lat)) {
    const geo = await geocodeLocation(listing.location, listing.country);
    if (geo) {
      listing.geometry = geo;
    }
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect('/listings');
};

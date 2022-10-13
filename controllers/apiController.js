const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Treveler = require("../models/Booking");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Booking = require("../models/Booking");
const Comment = require("../models/Comment");
const Member = require("../models/Member");
const Users = require("../models/Users");
const Pengguna = require("../models/Pengguna");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title thumbnail penulis urlPenulis dilihat isPopular")
        .sort({ dilihat: -1 })
        .limit(12)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title thumbnail penulis isPopular  urlPenulis",
          perDocumentLimit: 4,
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      const treveler = await Treveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      res.status(200).json({
        mostPicked,
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  categoryPage: async (req, res) => {
    try {
      const category = await Category.find()
        .select("_id name")
        .populate({
          path: "itemId",
          select: "_id title country city isPopular  imageId",
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      res.status(200).json({
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  categoriListPage: async (req, res) => {
    try {
      const { id } = req.params;
      const items = await Item.find({ categoryId: id })
        .select("_id title thumbnail penulis urlPenulis dilihat isPopular")
        .sort({ dilihat: -1 })
        .populate({ path: "imageId", select: "_id imageUrl" });

      res.status(200).json({
        items,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  searchUserInput: async (req, res) => {
    try {
      const { userinput } = req.params;
      const items = await Item.find({
        title: { $regex: ".*" + userinput + ".*" },
      })
        .select("_id title thumbnail penulis urlPenulis dilihat isPopular")
        .sort({ dilihat: -1 })
        .populate({ path: "imageId", select: "_id imageUrl" });

      res.status(200).json({
        items,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({
          path: "featureId",
          select: "_id title thumbnail penulis description",
        })
        .populate({ path: "commentId", select: "_id komentar pengguna" });
      1;
      item.dilihat += 1;
      await item.save();

      res.status(200).json({
        ...item._doc,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  detailPageNextEpisode: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "featureId", select: "_id title thumbnail penulis" })
        .populate({ path: "commentId", select: "_id komentar pengguna" });
      1;

      res.status(200).json({
        item,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  },

  addComment: async (req, res) => {
    const { id } = req.params;
    const { userid } = req.params;
    try {
      const userLogin = await Pengguna.findOne({ _id: userid });

      var nama = userLogin.username;
      var foto = userLogin.profileUrl;
      var ig = userLogin.instagramUrl;
      var twitter = userLogin.twitterUrl;

      var datapengguna = new Pengguna({
        profileUrl: foto,
        username: nama,
      });

      const comment = new Comment({
        komentar: req.body.komentar,
        itemId: id,
        pengguna: datapengguna,
      });

      await comment.save();

      const userComment = await Item.findOne({ _id: id });
      userComment.commentId.push(comment);
      await userComment.save(function (err) {
        if (err) {
          res.status(500).json({ message: "Post error" + err });
        }
      });
      res.status(200).json({
        ...userComment._doc,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(idItem);

    if (
      idItem === undefined ||
      duration === undefined ||
      // price === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      res.status(404).json({ message: "Lengkapi semua field" });
    }

    const item = await Item.findOne({ _id: idItem });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.sumBooking += 1;

    await item.save();

    let total = item.price * duration;
    let tax = total * 0.1;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: (total += tax),
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: duration,
      },

      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Success Bookings", booking });
  },
};

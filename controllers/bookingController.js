import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "your tour is booked",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "booking failed",
    });
  }
};

// get single book
export const getBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Booking.findById(id);

    res.status(200).json({
      success: true,
      message: "successfully fetched",
      data: book,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

// get all bookings
export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      success: true,
      message: "successfully fetched",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "fetching failed",
    });
  }
};

import { User } from "../models/user.js";

export const showLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.find().sort({
        codeforcesRating: -1,
        });

        res.status(200).json({
            success: true,
            leaderboard,
        });
    } catch (error) {
        next(error);
    }
}
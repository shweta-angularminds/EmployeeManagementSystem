import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const getCookieOptions = (type) => {
  const options = {
    httpOnly: true,
    secure: false,
    crossSite: "True",
    path: "/",
  };

  if (type === "accessToken") {
    options.expires = new Date(Date.now() + 30 * 60 * 1000); // 3 minutes
  } else if (type === "refreshToken") {
    options.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 10 days
  }

  return options;
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, organization } = req.body;
  if (
    [username, email, password, organization].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await Admin.findOne({
    $or: [{ username }, { email }, { organization }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User with email ororganization or username already exists"
    );
  }
  const user = await Admin.create({
    username: username.toLowerCase(),
    email,
    organization: organization.toLowerCase(),
    password,
  });
  const createdUser = await Admin.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error to register user!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(404, "Email is required");
  }
  if (!password) {
    throw new ApiError(404, "Password is required");
  }
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await Admin.findById(user._id).select(
    "-password -refreshToken"
  );
  // const options = {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "None",
  //   path: "/",
  // };
  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions("accessToken"))
    .cookie("refreshToken", refreshToken, getCookieOptions("refreshToken"))
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged In Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.user_id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: false,
    crossSite: "True",
    path: "/",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await Admin.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      console.log("\n \n Refresh token expired\n \n");
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const refreshTokenExpiryTime = decodedToken.exp;

    let refreshToken;
    if (refreshTokenExpiryTime <= currentTime) {
      refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;

      await user.save({ validateBeforeSave: false });
    } else {
      refreshToken = incomingRefreshToken;
    }

    const accessToken = user.generateAccessToken();

    return res
      .status(200)
      .cookie("accessToken", accessToken, getCookieOptions("accessToken"))
      .cookie("refreshToken", refreshToken, getCookieOptions("refreshToken"))
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
  } catch (error) {
    const options = {
      httpOnly: true,
      secure: false,
      crossSite: "True",
      path: "/",
    };
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options);

    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const self = asyncHandler(async (req, res) => {
  const data = {
    username: req.user.username,

    email: req.user.email,
    organization: req.user.organization,
  };

  return res
    .status(200)

    .send(data);
});

export { registerUser, loginUser, logOutUser, self, refreshAccessToken };

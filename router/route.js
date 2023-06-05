const express = require("express");
const router = express.Router();

//<<<<<============================ Importing Modules ===============================>>>>>>>>//
const {
    userRegister,
    loginUser
} = require("../controller/userController");

const {
    createItem,
    getItem,
    getItembyId,
    updateItembyId,
    deleteItembyId
} = require("../controller/itemController");

const { Authentication, Authorization } = require("../middleware/Auth");

//<<<<============================ API and Method Routes =================================>>>>>//

//------------------- User APIs ------------------------------//

router.post("/register", userRegister);
router.post("/login", loginUser);

//-------------------------- item APIs ----------------------//

router.post("/items", Authentication, createItem);
router.get("/items", Authentication, getItem);
router.get("/items/:itemId", Authentication, getItembyId);
router.put("/items/:itemId", Authentication, Authorization, updateItembyId);
router.delete("/items/:itemId", Authentication, Authorization, deleteItembyId);


//------------------- Exporting Modules -------------------//

module.exports = router;
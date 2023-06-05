const itemModel = require("../model/itemModel");
const {
    isValid,
    isValidObjectId,
    isValidRequestBody,
    isValidTName,
} = require("../utils/util");


//<<============================ Create  Item  ==============================>>//

const createItem = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.userId
        let {
            title,
            description,
            price,
            currencyId,

        } = data;

        if (!isValidRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "Provide the data for creating Item ",
            });
        }

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: "Provide the title Name " });
        }

        let checkTitle = await itemModel.findOne({ title: title.toLowerCase() });
        if (checkTitle) {
            return res.status(400).send({
                status: false,
                message: "Item with this title is already present",
            });
        }
        data.title = title.toLowerCase();

        if (!isValid(description)) {
            return res.status(400).send({
                status: false,
                message: "please write description about item ",
            });
        }

        if (!isValid(price)) {
            return res
                .status(400)
                .send({ status: false, message: "price is required" });
        }

        if (!/\d+(?:[.,]\d{0,2})?/.test(price)) {
            return res
                .status(400)
                .send({ status: false, message: "price Must be in Numbers" });
        }


        if (!isValid(currencyId)) {
            return res
                .status(400)
                .send({ status: false, message: "Provide the currencyId " });
        }


        data.userId = userId
        const createdItem = await itemModel.create(data);
        return res.status(201).send({
            status: true,
            message: "Success",
            data: createdItem,
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

//<<============================Get Item By Id ==============================>>//

const getItem = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skipIndex = (page - 1) * limit;

        const finditemDb = await itemModel.find({
            isDeleted: false,
        }).skip(skipIndex)
            .limit(limit)

        if (!finditemDb) {
            return res.status(404).send({ status: false, message: "Data Not Found" });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: finditemDb,
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};


const getItembyId = async function (req, res) {
    try {
        let Pid = req.params.itemId;

        if (!isValidObjectId(Pid)) {
            return res.status(400).send({
                status: false,
                message: "Invalid item ID please Provide Valid Credential",
            });
        }

        const findItemDb = await itemModel.findOne({
            _id: Pid,
            isDeleted: false,
        });

        if (!findItemDb) {
            return res.status(404).send({ status: false, message: "Data Not Found" });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: findItemDb,
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};



const updateItembyId = async function (req, res) {
    try {
        let itemId = req.params.itemId;
        let userId = req.userId
        // console.log(itemId)
        // console.log(userId)
        if (itemId.length == 0 || itemId == ":itemId")
            return res
                .status(400)
                .send({ status: false, message: "Please enter itemId in params" });
        if (!isValidObjectId(itemId))
            return res
                .status(400)
                .send({ status: false, message: "Enter Id in valid Format" });

        let data = await itemModel.findOneAndUpdate({ _id: itemId, userId: userId }, { new: true });
        if (!data)
            return res
                .status(404)
                .send({ status: false, message: "No Data found with this ID" });
        if (data.isDeleted == true) {
            return res
                .status(400)
                .send({ status: false, message: "This item is Deleted" });
        }

        let body = req.body;


        let {
            title,
            description,
            price,
        } = body;

        if ("title" in body) {
            if (!isValid(title))
                return res
                    .status(400)
                    .send({ status: false, message: "Title should not be empty" });
            if (!isValidTName(title))
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid Title Name" });

            let istitle = await itemModel.findOne({ title: title.toLowerCase() });

            if (istitle)
                return res
                    .status(400)
                    .send({ status: false, message: `${title} is already exists` });

            let title1 = title
                .split(" ")
                .filter((e) => e)
                .join(" ");
            data.title = title1.toLowerCase();
        }

        if ("description" in body) {
            if (!isValid(description))
                return res
                    .status(400)
                    .send({ status: false, message: "Description should not be empty" });
            data.description = description
                .split(" ")
                .filter((e) => e)
                .join(" ");
        }
        if ("price" in body) {
            if (!isValid(price))
                return res
                    .status(400)
                    .send({ status: false, message: "Price should not be empty" });
            if (isNaN(parseInt(price)))
                return res
                    .status(400)
                    .send({ status: false, message: "Price Should Be A Number" });
            data.price = price;
        }





        await itemModel.findOneAndUpdate(
            { _id: itemId },
            { new: true }
        );


        data.save();
        res.status(200).send({
            status: true,
            message: "Update item details is successful",
            data: data,
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

//<<============================ Delete Item By Id ==============================>>//

const deleteItembyId = async function (req, res) {
    try {
        let Pid = req.params.itemId;

        if (!isValidObjectId(Pid)) {
            return res.status(400).send({
                status: false,
                message: "Invalid item ID please Provide Valid Credential",
            });
        }

        const findItemDb = await itemModel.findOneAndUpdate(
            {
                _id: Pid,
                isDeleted: false,
            },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!findItemDb) {
            return res
                .status(404)
                .send({ status: false, message: "Data Not Found Or Already Deleted" });
        }

        return res.status(200).send({
            status: true,
            message: "Deleted Successfully",
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = {
    createItem,
    getItem,
    getItembyId,
    updateItembyId,
    deleteItembyId,
};
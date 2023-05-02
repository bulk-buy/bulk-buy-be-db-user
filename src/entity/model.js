/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "__v"] }] */

// ===============
// DEPENDENCIES
// ===============

/**
 * Internal dependencies.
 */

const config = require("../config");
const { framework: mongoose, logger } = require("../services/database");

// ===============
// DATABASE
// ===============

// database definition
const options = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email"],
      properties: {
        firstName: {
          bsonType: "string",
          description: "must be a string",
        },
        lastName: {
          bsonType: "string",
          description: "must be a string",
        },
        phone: {
          bsonType: "string",
          description: "must be a string",
        },
        email: {
          bsonType: "string",
          description: "is required, must be a string",
        },
        streetName: {
          bsonType: "string",
          description: "must be a string",
        },
        block: {
          bsonType: "string",
          description: "must be a string",
        },
        unit: {
          bsonType: "string",
          description: "must be a string",
        },
        deletedAt: {
          bsonType: "date",
        },
      },
    },
  },
  validationAction: "error",
  validationLevel: "strict",
};

// create table if not created
mongoose.connection.on("open", () => {
  mongoose.connection.db
    .createCollection(config.dbTableName, options)
    .then((collection) => {
      collection.createIndex({ email: 1 });
      collection.createIndex({ deletedAt: 1 });
    })
    .catch((err) => {
      /* istanbul ignore else */
      if (err.code === 48) {
        // ignore if table already exists
      } else {
        logger.error(err);
      }
    });
});

// ===============
// MONGOOSE
// ===============

// mongoose schema
const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    streetName: {
      type: String,
    },
    block: {
      type: String,
    },
    unit: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    shardKey: { deletedAt: 1 },
    timestamps: true,
  }
);

// define Entity model (will create table & indexes if autoCreate & autoIndex not disabled)
// https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.model()
const Entity = mongoose.model(config.dbModelName, schema, config.dbTableName);

// ===============
// CRUD
// ===============

const incDeletedCondition = (incDeleted) =>
  incDeleted ? {} : { deletedAt: { $exists: false } };

// (C)REATE
exports.createEntity = (data) => {
  const entity = new Entity(data);
  return entity.save();
};

// (R)ETRIEVE
exports.getEntity = (query, incDeleted = false) => {
  const condition = incDeletedCondition(incDeleted);
  if (typeof query === "string") {
    condition._id = query;
    return Entity.findOne(condition).then((result) => result);
  }
  return Entity.find(condition).then((result) => result);
};
exports.getEntities = (incDeleted = false) => {
  const condition = incDeletedCondition(incDeleted);
  return Entity.find(condition)
    .select("_id")
    .lean()
    .then((result) => result.map((doc) => doc._id));
};

// (U)PDATE
exports.updateEntity = (id, data) => {
  // current and new version for optimistic concurrency
  const { __v } = data;
  data.__v += 1;

  // atomic operation with optimistic concurrency
  return Entity.findOneAndUpdate(
    {
      _id: id,
      __v,
    },
    data,
    { new: true }
  );
};

// (D)ELETE
// do not expose hard-delete
/*
exports.removeEntity = (id, data) => {
  // current version for optimistic concurrency
  const { __v } = data;

  // atomic operation with optimistic concurrency
  return Entity.findOneAndDelete(
    {
      _id: id,
      __v,
    }
  );
};
*/

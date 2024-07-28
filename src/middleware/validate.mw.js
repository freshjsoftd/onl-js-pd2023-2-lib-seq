const yup = require('yup');

const {
	AUTHOR_VALIDATION_SCHEMA,
	CUSTOMER_VALIDATION_SCHEMA,
	NEW_BOOK_VALIDATION_SCHEMA,
	PATCH_BOOK_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');

module.exports.validateAuthor = async (req, res, next) => {
  const { body } = req;
  try {
    await AUTHOR_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });
    // req.body = validatedAuthor;
    next();
  } catch (error) {
    console.log(error.errors);
    next(error);
  }
};

module.exports.validateCustomer = async (req, res, next) => {
  const { body } = req;
  try {
    await CUSTOMER_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });
    // req.body = validatedCustomer;
    next();
  } catch (error) {
    console.log(error.errors);
    next(error);
  }
};

module.exports.validateBook = async (req, res, next) => {
  const { body } = req;
  try {
    await NEW_BOOK_VALIDATION_SCHEMA.validate(body, {
		abortEarly: false,
	});
    // req.body = validatedBook;
    next();
  } catch (error) {
    console.log(error.errors);
    next(error);
  }
};

module.exports.validatePatchBook = async (req, res, next) => {
  const { body } = req;
  try {
    await PATCH_BOOK_VALIDATION_SCHEMA.validate(body, {
		abortEarly: false,
	});
    // req.body = validatedBook;
    next();
  } catch (error) {
    console.log(error.errors);
    next(error);
  }
};

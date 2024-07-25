const yup = require('yup');

const TITLE_NAME_SCHEMA = yup.string()
      .trim()
      .min(2)
      .max(30)
      .matches(/^[A-Z](\w+\s?){1,50}\w+$/);

const EMAIL_SCHEMA = yup.string().email().required();

const ID_SCHEMA = yup.number()
      .integer('This fild must be integer')
      .positive('This fild must be more than 0')

const AUTHOR_VALIDATION_SCHEMA = yup.object().shape({
  full_name: TITLE_NAME_SCHEMA.required(),
  email: EMAIL_SCHEMA,
  nationality_id: ID_SCHEMA,
});

const CUSTOMER_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  // email: EMAIL_SCHEMA,
  // phone: yup.string().nullable(),
  // password: yup.string().required(),
});

const NEW_BOOK_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_NAME_SCHEMA.required(),
  genre_id: ID_SCHEMA,
  shelf_id: ID_SCHEMA,
  // image: yup.string().nullable(),
});

const PATCH_BOOK_VALIDATION_SCHEMA = yup.object().shape({
  title: yup.string().trim().min(2).max(30),
  genre_id: ID_SCHEMA,
  shelf_id: ID_SCHEMA,
  // image: yup.string().nullable(),
});

const PAGINATION_SCHEMA = yup.object().shape({
  limit: yup.number().min(1).max(100).required(),
  offset: yup.number().positive().required(),
})

module.exports = {
  AUTHOR_VALIDATION_SCHEMA,
  CUSTOMER_VALIDATION_SCHEMA,
  NEW_BOOK_VALIDATION_SCHEMA,
  PATCH_BOOK_VALIDATION_SCHEMA,
  PAGINATION_SCHEMA
};

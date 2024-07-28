const createError = require('http-errors');
const { Book, Genre, Shelf, sequelize } = require('../db/models');
const { where } = require('sequelize');

class BookController {
	async getBooks(req, res, next) {
		try {
			const { limit, offset } = req.pagination;
			const books = await Book.findAll({
				attributes: ['id', 'title'],
				include: [
					{
						model: Genre,
						attributes: ['title'],
					},
					{
						model: Shelf,
						attributes: ['title'],
					},
				],
				raw: true,
				limit,
				offset,
				order: [['id', 'DESC']],
			});
			if (books.length > 0) {
				console.log(`Resuly is: ${JSON.stringify(books, null, 2)}`);
				res.status(200).json(books);
			} else {
				next(createError(404, 'Books not found'));
				// res.status(404).send('Books not found');
			}
		} catch (error) {
			console.log(error.message);
			next(error.message);
			// res.status(500).json({ error: 'Internal server error' });
		}
	}

	async getBookById(req, res, next) {
		try {
			const {
				params: { bookId },
			} = req;
			const bookById = await Book.findByPk(bookId, {
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
				raw: true,
			});

			if (bookById) {
				console.log(`Result is: ${JSON.stringify(bookById, null, 2)}`);
				res.status(200).json(bookById);
			} else {
				console.log('Book not found');
				next(createError(404, 'Book not found'));
				// res.status(404).send('Book not found');
			}
		} catch (error) {
			console.log(error.message);
			next(error);
			// res.status(500).json({ error: 'Internal server error' });
		}
	}

	async createBook(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const { title, description, image, genre, shelf} = req.body;
			/* const newBook = await db.query(
				`INSERT INTO books (title, genre_id, shelf_id, description, "createdAt", "updatedAt", image)
        VALUES ($1, (SELECT id FROM genres WHERE title = $2), (SELECT id FROM shelves WHERE title = $3), $4, NOW(), NOW(), $5)
        RETURNING *;`,
				[title, genre, shelves, description, image]
			); */
			const genreId = await Genre.findOne({
				where: {
					title: genre,
				},
				attributes: ['id'],
				raw: true,
			})
			console.log(genreId);

			const shelfId = await Shelf.findOne({
				where: {
					title: shelf,
				},
				attributes: ['id'],
				raw: true,
			})
			console.log(shelfId);

			const { id: genre_id } = genreId;

			const { id: shelf_id } = shelfId;

			const newBody = { title, description, image, genre_id , shelf_id};
			
			const newBook = await Book.create(newBody, {
				returning: ['id'],
				transaction: t,
			});

			if (newBook) {
				console.log(`Result is : ${JSON.stringify(newBook, null, 2)}`);
				res.status(201).json(newBook);
			} else {
				console.log('Bad request');
				next(createError(400, 'Bad request'));
			}
			await t.commit();
		} catch (error) {
			console.log('Error is', error.message);
			await t.rollback();
			next(error);
		}
	}

	async updateBook(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const { body } = req;
			const updatedBook = await Book.update(body, {
				where: {
					id: body.id,
				},
				transaction: t,
				raw: true,
				returning: ['title', 'shelf_id'],
			});
			if (updatedBook) {
				console.log(
					`Result is : ${JSON.stringify(updatedBook, null, 2)}`
				);
				res.status(201).json(updatedBook);
			} else {
				console.log('Book not found');
				next(createError(404, 'Book not found'));
			}
			await t.commit();
		} catch (error) {
			console.log('Error is', error.message);
			await t.rollback();
			next(error);
		}
	}

	async deleteBook(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const {
				params: { bookId },
			} = req;
			const delBook = await Book.destroy({
				where: {
					id: bookId,
				},
				transaction: t,
			});
			if (delBook) {
				console.log(res.statusCode, 'Book has been deleted');
				res.sendStatus(res.statusCode);
			} else {
				console.log(res.statusCode);
				next(createError(404, 'Book not found'));
			}
			await t.commit();
		} catch (error) {
			console.log('Error is', error.message);
			await t.rollback();
			next(error);
		}
	}

	async patchBook(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const {
				params: { bookId },
				body,
			} = req;
			const [count, [updatedBooks]] = await Book.update(body, {
				where: {
					id: bookId,
				},
				transaction: t,
				raw: true,
				returning: ['title', 'genre_id'],
			});
			if (count > 0) {
				console.log(
					`Result is : ${JSON.stringify(updatedBooks, null, 2)}`
				);
				res.status(200).json(updatedBooks);
			} else {
				console.log('Book not found');
				next(createError(404, 'Book not found'));
			}
			await t.commit();
		} catch (error) {
			console.log('Error is', error.message);
			await t.rollback();
			next(error);
		}
	}

	async changeImage(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const {
				file: { filename },
				params: { bookId },
			} = req;
			const [count, [updatedBooks]] = await Book.update(
				{ image: filename },
				{
					where: {
						id: bookId,
					},
					returning: ['id', 'title'],
					raw: true,
					fields: ['image'],
					silent: true,
					transaction: t,
				}
			);
			console.log(count);
			console.log(updatedBooks);
			if (count > 0) {
				console.log(
					`Result is : ${JSON.stringify(updatedBooks, null, 2)}`
				);
				res.status(200).json(updatedBooks);
			} else {
				console.log('Book not found');
				next(createError(404, 'Book not found'));
			}
			await t.commit();
		} catch (error) {
			console.log('Error is', error.message);
			await t.rollback();
			next(error);
		}
	}
}

module.exports = new BookController();

const createError = require('http-errors');
const { Book, Genre, Shelf, sequelize } = require('../db/models');

class BookController {
	async getBooks(req, res, next) {
		try {
			/* const books = await db.query(
        `SELECT books.id, books.title, gen.title as genre, shelf.title as shelves, books.description, to_char(books."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(books."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", image
        FROM books 
        JOIN genres as gen
        ON books.genre_id = gen.id
        JOIN shelves as shelf
        ON books.shelf_id = shelf.id
        ORDER BY books.id;;`
      ); */
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
			/* const book = await db.query(
				`SELECT books.id, books.title, gen.title as genre, shelf.title as shelves, books.description, to_char(books."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(books."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", image
        FROM books 
        JOIN genres as gen
        ON books.genre_id = gen.id
        JOIN shelves as shelf
        ON books.shelf_id = shelf.id
        WHERE books.id = $1`,
				[bookId]
			); */
			const bookById = await Book.findByPk(bookId, {
				attributes: {
					exclude: ['createdAt', 'updatedAt']
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
			next(error)
			// res.status(500).json({ error: 'Internal server error' });
		}
	}

	async createBook(req, res, next) {
		try {
			const body = req.body;
			/* const newBook = await db.query(
				`INSERT INTO books (title, genre_id, shelf_id, description, "createdAt", "updatedAt", image)
        VALUES ($1, (SELECT id FROM genres WHERE title = $2), (SELECT id FROM shelves WHERE title = $3), $4, NOW(), NOW(), $5)
        RETURNING *;`,
				[title, genre, shelves, description, image]
			); */
			const newBook = await Book.create(body, {
				returning: ['id'],
			})

			if (newBook) {
				console.log(`Result is : ${JSON.stringify(newBook, null, 2)}`)
				res.status(201).json(newBook);
			} else {
				console.log('Bad request');
				next(createError(400, 'Bad request'));
			}
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	}

	async updateBook(req, res) {
		try {
			const { title, genre, shelves, description, image, id } = req.body;
			const updatedBook = await db.query(
				`UPDATE books
        SET title=$1, genre_id=(SELECT id FROM genres WHERE title = $2), shelf_id=(SELECT id FROM shelves WHERE title = $3), description=$4, "updatedAt"=NOW(), image=$5 WHERE id=$6 RETURNING *`,
				[title, genre, shelves, description, image, id]
			);

			if (updatedBook.rows.length > 0) {
				res.status(201).json(updatedBook.rows[0]);
			} else {
				res.status(404).send('Book not found');
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}

	async deleteBook(req, res) {
		try {
			const {
				params: { bookId },
			} = req;
			const delBook = await db.query(
				`DELETE FROM books WHERE id=$1 RETURNING title, id`,
				[bookId]
			);

			if (delBook.rows.length > 0) {
				res.status(204).json(delBook.rows[0]);
			} else {
				res.status(404).send('Book not found');
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}

module.exports = new BookController();

describe('Smoke tests', () => {
	beforeEach( () => {
		cy.request("GET", "http://localhost:3030/api/todos")
			.its('body')
			.each(todo => cy.request(
				'DELETE',
				`http://localhost:3030/api/todos/${todo.id}`
			))
	})

	context('With no todos', ()=>{
		it.only('Saves new todos', () => {

			const items = [
				{text: 'Buy milk', expectedLength: 1},
				{text: 'Buy eggs', expectedLength: 2},
				{text: 'Buy bread', expectedLength: 3},
			]

			cy.visit("http://localhost:3030")
			cy.server()
			cy.route('POST', '/api/todos')
				.as('create')

			cy.wrap(items)
				.each(todo => {
					cy.focused()
						.type(todo.text)
						.type('{enter}')
					// tell cypress to wait on post request until finished
					cy.wait('@create')
					cy.get('.todo-list li')
						.should('have.length', todo.expectedLength)
				})
		})
	})

	context('With active todos', () => {
		beforeEach( () => {
			cy.fixture('todos')
				.each(todo => {
					const newTodo = Cypress._.merge(todo, {isComplete: false})
					cy.request("POST", 'http://localhost:3030/api/todos', newTodo)
				})
			cy.visit("http://localhost:3030")
		})

		it.only('loads existing data from DB', () => {
			cy.get('.todo-list li')
				.should('have.length', 4)
		})

		it.only('Deletes todos', () => {
			cy.server()
			cy.route('DELETE', '/api/todos/*')
				.as('delete')

			cy.get('.todo-list li')
				.each($el => {
					cy.wrap($el)
						.find('.destroy')
						.invoke('show')
						.click()

					cy.wait('@delete')
				})
				.should('not.exist')
		})

		it.only('Toggles todos', () => {

			const clickAndWait = ($el) => {
					cy.wrap($el)
						.as('item')
						.find('.toggle')
						.click()
					cy.wait('@update')
			}

			cy.server()
			cy.route('PUT', '/api/todos/*')
				.as('update')

			cy.get('.todo-list li')
				.each($el => {
					clickAndWait($el)
					cy.get('@item')
						.should('have.class', 'completed')
				})
				.each($el => {
          clickAndWait($el)
          cy.get('@item')
            .should('not.have.class', 'completed')
        })  


		})

	})

})


describe('Input form', ()=>{

	beforeEach(()=>{
		//cy.visit("http://localhost:3030")
		cy.seedAndVisit([])
	})

	it("focus on input on load", () => {
		cy.focused()
			.should('have.class', 'new-todo')
	})

	it('accepts input', () => {
		const input = 'Buy Milk'
		cy.get('.new-todo')
			.type(input)
			.should('have.value', input)
	})

	context('Form submission', () => {

		beforeEach(()=>{
			cy.server()
		})

		it.only('Adds a new todo on submit', () => {
			const itemText = 'Buy eggs'
			cy.route("POST", '/api/todos', {
				name: itemText,
				id: 1,
				isComplete: false
			})

			cy.get('.new-todo')
      .type(itemText)
			.type("{enter}")
			.should('have.value', '')
		
			cy.get('.todo-list li')
				.should('have.length', 1)
				.and('contain', itemText)

		})

		it.only('shows an error message on failed submission', () => {
			cy.route({
				url: "/api/todos",
				method: 'POST',
				status: "500",
				response: {}
			})
			.as('create')


			cy.get('.new-todo')
				.type('test todo{enter}')

			//TodoApp.handleTodoSubmit added delay on purpose
			cy.wait('@create')
				
			cy.get('.todo-list li')
				.should('not.exist')

			cy.get('.error')
				.should('be.visible')

		})

	})

})

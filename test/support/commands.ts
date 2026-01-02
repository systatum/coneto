/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export function getIdContent(string: string): string {
  return `/iframe.html?id=${string}`;
}

export function expectTextIncludesOrderedLines(text: string, lines: string[]) {
  const escaped = lines.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = escaped.join("[\\s\\S]*");
  const regex = new RegExp(pattern);
  expect(text).to.match(regex);
}

// Helper function to test drag behavior using edge-based drop intent rules
export function dragOverAtEdge(
  subject: Cypress.Chainable<JQuery<HTMLElement>>,
  edge: "top" | "bottom",
  dataTransfer: DataTransfer
) {
  return subject.then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    const DRAG_REORDER_EDGE_THRESHOLD = 6;

    const clientY =
      edge === "top"
        ? rect.top + DRAG_REORDER_EDGE_THRESHOLD - 5
        : rect.top + rect.height - DRAG_REORDER_EDGE_THRESHOLD + 5;

    return cy.wrap($el).trigger("dragover", {
      dataTransfer,
      clientY,
      force: true,
    });
  });
}

import { Table, TableColumn } from "./../../components/table";
import { Button } from "./../../components/button";
import {
  Flippable,
  FlippableProps,
  FlippableRef,
} from "./../../components/flippable";
import { useRef, useState } from "react";
import styled, { css } from "styled-components";

describe("Flippable", () => {
  function ProductFlippable(props?: FlippableProps) {
    const ref = useRef<FlippableRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Flippable back="back" {...props} ref={ref}>
          {props?.children ?? "front"}
        </Flippable>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button onClick={() => ref.current?.flip()}>Show back</Button>
          <Button onClick={() => ref.current?.unFlip()}>Show front</Button>
          <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        </div>
      </div>
    );
  }

  context("scroll behavior", () => {
    function FlippableWithTable({
      tableOnFrontFace,
    }: {
      tableOnFrontFace?: boolean;
    }) {
      interface Person {
        name: string;
        role: string;
        backgroundColor: string;
        email: string;
        employeeId: string;
        department: string;
      }
      const PEOPLE: Person[] = [
        {
          name: "Adam Hakarsa",
          role: "CEO",
          backgroundColor: "#0077b5",
          email: "adam@systatum.com",
          employeeId: "SYS-001",
          department: "Executive",
        },
        {
          name: "Alim Naufal",
          role: "Frontend Engineer",
          backgroundColor: "#6c5ce7",
          email: "alim@systatum.com",
          employeeId: "SYS-002",
          department: "Engineering",
        },
        {
          name: "Sarah Amira",
          role: "Product Designer",
          backgroundColor: "#e17055",
          email: "sarah@systatum.com",
          employeeId: "SYS-003",
          department: "Design",
        },
        {
          name: "Kevin Tan",
          role: "QA Engineer",
          backgroundColor: "#00b894",
          email: "kevin@systatum.com",
          employeeId: "SYS-004",
          department: "Quality Assurance",
        },
        {
          name: "Budi Santoso",
          role: "Backend Engineer",
          backgroundColor: "#0984e3",
          email: "budi@systatum.com",
          employeeId: "SYS-005",
          department: "Engineering",
        },
        {
          name: "Rina Prasetyo",
          role: "Product Manager",
          backgroundColor: "#fd79a8",
          email: "rina@systatum.com",
          employeeId: "SYS-006",
          department: "Product",
        },
        {
          name: "Michael Ong",
          role: "DevOps Engineer",
          backgroundColor: "#636e72",
          email: "michael@systatum.com",
          employeeId: "SYS-007",
          department: "Infrastructure",
        },
        {
          name: "Nadia Putri",
          role: "UI Designer",
          backgroundColor: "#f39c12",
          email: "nadia@systatum.com",
          employeeId: "SYS-008",
          department: "Design",
        },
        {
          name: "Daniel Wijaya",
          role: "Mobile Engineer",
          backgroundColor: "#8e44ad",
          email: "daniel@systatum.com",
          employeeId: "SYS-009",
          department: "Engineering",
        },
        {
          name: "Jonathan Lee",
          role: "Backend Engineer",
          backgroundColor: "#16a085",
          email: "jonathan@systatum.com",
          employeeId: "SYS-010",
          department: "Engineering",
        },
        {
          name: "Aisyah Rahman",
          role: "HR Manager",
          backgroundColor: "#c0392b",
          email: "aisyah@systatum.com",
          employeeId: "SYS-011",
          department: "Human Resources",
        },
        {
          name: "William Tan",
          role: "Data Engineer",
          backgroundColor: "#2980b9",
          email: "william@systatum.com",
          employeeId: "SYS-012",
          department: "Data",
        },
        {
          name: "Felicia Lim",
          role: "Marketing Manager",
          backgroundColor: "#d35400",
          email: "felicia@systatum.com",
          employeeId: "SYS-013",
          department: "Marketing",
        },
        {
          name: "Andre Kurniawan",
          role: "Security Engineer",
          backgroundColor: "#2c3e50",
          email: "andre@systatum.com",
          employeeId: "SYS-014",
          department: "Security",
        },
        {
          name: "Cindy Hartono",
          role: "Customer Success",
          backgroundColor: "#27ae60",
          email: "cindy@systatum.com",
          employeeId: "SYS-015",
          department: "Customer Success",
        },
      ];

      const [person, setPerson] = useState<Person | null>(PEOPLE[0]);

      const ref = useRef<FlippableRef>(null);

      const columns: TableColumn[] = [
        {
          id: "name",
          caption: "Name",
          sortable: false,
        },
        {
          id: "role",
          caption: "Role",
          sortable: false,
        },
      ];

      const style = css`
        background: ${person?.backgroundColor ?? "#0077b5"};
        padding: 24px;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;

      const TableContent = () => (
        <Table columns={columns}>
          {PEOPLE.map((person) => (
            <Table.Row
              key={person.employeeId}
              rowId={person.employeeId}
              content={[person.name, person.role]}
              onClick={() => {
                setPerson(person);
              }}
            />
          ))}
        </Table>
      );

      const LabelContent = () =>
        person && (
          <>
            <div>
              <Label>Employee Profile</Label>
              <Name>{person.name}</Name>
              <Value>{person.role}</Value>
            </div>

            <div>
              <Label>Email</Label>
              <Value>{person.email}</Value>
            </div>

            <div>
              <Label>Department</Label>
              <Value>{person.department}</Value>
            </div>

            <div>
              <Label>Employee ID</Label>
              <Value>{person.employeeId}</Value>
            </div>

            <Hint>← Click "Show table" to return</Hint>
          </>
        );

      return (
        <Flippable
          ref={ref}
          width={420}
          height={350}
          flipDuration={0.7}
          flipOnClick
          back={tableOnFrontFace ? <LabelContent /> : <TableContent />}
          styles={{
            backStyle: tableOnFrontFace ? style : undefined,
            frontStyle: tableOnFrontFace ? undefined : style,
          }}
        >
          {tableOnFrontFace ? <TableContent /> : <LabelContent />}
        </Flippable>
      );
    }

    context("table in front face", () => {
      context("when scrolling in the front face", () => {
        it("renders content on the bottom", () => {
          cy.mount(<FlippableWithTable tableOnFrontFace />);
          cy.findByText("Cindy Hartono").should("not.be.visible");
          cy.findByLabelText("table-body").scrollTo(0, 1000);
          cy.findByText("Cindy Hartono").should("be.visible");
        });
      });
    });

    context("table in back face", () => {
      context("when scrolling in the front face", () => {
        it("renders content on the bottom", () => {
          cy.mount(<FlippableWithTable />);
          cy.contains("Show table").click();
          cy.findByText("Cindy Hartono").should("not.be.visible");
          cy.findByLabelText("table-body").scrollTo(0, 1000);
          cy.findByText("Cindy Hartono").should("be.visible");
        });
      });
    });
  });

  context("id", () => {
    context("when given with systatum-will-success", () => {
      it("should renders id with name systatum-will-success", () => {
        cy.mount(<ProductFlippable id="systatum-will-success" />);

        cy.get("#systatum-will-success").should("exist");
      });
    });
  });

  context("flipDuration", () => {
    it("should apply transition duration", () => {
      cy.mount(<ProductFlippable flipDuration={2} />);

      cy.findByLabelText("flippable-front-face").should(
        "have.css",
        "transition-duration",
        "0.8s, 0s, 0s"
      );
    });
  });

  context("width", () => {
    context("when given string", () => {
      it("should render with width 500px", () => {
        cy.mount(<ProductFlippable width="500px" />);

        cy.findByLabelText("flippable").should("have.css", "width", "500px");
      });
    });

    context("when given number", () => {
      it("should render with width 500px", () => {
        cy.mount(<ProductFlippable width={500} />);

        cy.findByLabelText("flippable").should("have.css", "width", "500px");
      });
    });
  });

  context("height", () => {
    context("when given string", () => {
      it("should render with height 500px", () => {
        cy.mount(<ProductFlippable height="500px" />);

        cy.findByLabelText("flippable").should("have.css", "height", "500px");
      });
    });

    context("when given number", () => {
      it("should render withht 500px", () => {
        cy.mount(<ProductFlippable height={500} />);

        cy.findByLabelText("flippable").should("have.css", "height", "500px");
      });
    });
  });

  context("children", () => {
    it("should render the front content", () => {
      cy.mount(<ProductFlippable>front-content</ProductFlippable>);

      cy.contains("front-content").should("exist");
    });
  });

  context("back", () => {
    it("should render the back content", () => {
      cy.mount(<ProductFlippable back="back-content" />);

      cy.contains("back-content").should("exist");
    });
  });

  context("onFlip", () => {
    it("should call onFlip(true) when opened", () => {
      const onFlip = cy.stub().as("onFlip");

      cy.mount(<ProductFlippable onFlip={onFlip} />);

      cy.findByText("Show back").click();

      cy.get("@onFlip").should("have.been.calledWith", true);
    });

    it("should call onFlip(false) when closed", () => {
      const onFlip = cy.stub().as("onFlip");

      cy.mount(<ProductFlippable onFlip={onFlip} />);

      cy.findByText("Show back").click();
      cy.findByText("Show front").click();

      cy.get("@onFlip").should("have.been.calledWith", false);
    });
  });

  context("ref", () => {
    context("flip()", () => {
      context("when clicking", () => {
        it("should show the back face", () => {
          cy.mount(<ProductFlippable />);

          cy.findByText("Show back").click();

          cy.findByLabelText("flippable").should("have.css", "transform");
        });
      });
    });

    context("unFlip()", () => {
      context("when clicking after opened the back", () => {
        it("should return to the front face", () => {
          cy.mount(<ProductFlippable />);

          cy.findByText("Show back").click();
          cy.findByText("Show front").click();

          cy.findByLabelText("flippable").should(
            "have.attr",
            "aria-label",
            "flippable"
          );
        });
      });
    });

    context("toggle()", () => {
      it("should toggle between front and back", () => {
        cy.mount(<ProductFlippable />);
        cy.findByLabelText("flippable-front-face").should("be.visible");
        cy.findByLabelText("flippable-back-face").should("not.be.visible");

        cy.findByText("Toggle").click();

        cy.findByLabelText("flippable-front-face").should("not.be.visible");
        cy.findByLabelText("flippable-back-face").should("be.visible");

        cy.findByText("Toggle").click();

        cy.findByLabelText("flippable-front-face").should("be.visible");
        cy.findByLabelText("flippable-back-face").should("not.be.visible");
      });
    });
  });

  context("styles", () => {
    context("self", () => {
      context("when given height and width 500x500", () => {
        it("should render custom styles", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                self: {
                  width: "500px",
                  height: "500px",
                },
              }}
            />
          );

          cy.findByLabelText("flippable")
            .should("have.css", "width", "500px")
            .and("have.css", "height", "500px");
        });
      });
    });

    context("backStyle", () => {
      context("when given backgroundColor red", () => {
        it("should render with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                backStyle: {
                  backgroundColor: "red",
                },
              }}
            />
          );

          cy.findByText("Toggle").click();

          cy.findByLabelText("flippable-back-face").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("frontStyle", () => {
      context("when given backgroundColor red", () => {
        it("should render with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                frontStyle: {
                  backgroundColor: "red",
                },
              }}
            />
          );

          cy.findByLabelText("flippable-front-face").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });
  });
});

const Label = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Value = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
`;

const Hint = styled.p`
  margin-top: auto;
  font-size: 12px;
  opacity: 0.7;
`;

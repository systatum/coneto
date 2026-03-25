import { useMemo, useState } from "react";
import {
  Searchbox,
  SearchboxProps,
  SearchboxResultMenuItemProps,
} from "./../../components/searchbox";
import {
  RiUserLine,
  RiUserStarLine,
  RiUserSmileLine,
  RiUserHeartLine,
  RiUserVoiceLine,
  RiUserSettingsLine,
  RiUserSharedLine,
  RiUserSearchLine,
  RiUserAddLine,
} from "@remixicon/react";
import { List } from "./../../components/list";
import { css } from "styled-components";

describe("Searchbox", () => {
  function ProductSearchbox(
    props: SearchboxProps & {
      withOnChange?: boolean;
    }
  ) {
    const [value, setValue] = useState("");
    return (
      <Searchbox
        value={value}
        onChange={
          props?.withOnChange ? (e) => setValue(e.target.value) : undefined
        }
        {...props}
      />
    );
  }

  context("onChange", () => {
    context("when given", () => {
      it("should change the value", () => {
        cy.mount(<ProductSearchbox withOnChange />);

        cy.findByRole("textbox")
          .click()
          .type("1234")
          .should("have.value", "1234");
      });
    });

    context("when not given", () => {
      it("should not changes the value", () => {
        cy.mount(<ProductSearchbox />);

        cy.findByRole("textbox").type("1234").should("have.value", "");
      });
    });
  });

  context("resultMenu", () => {
    context("list", () => {
      const PEOPLE_MENU: SearchboxResultMenuItemProps[] = [
        {
          caption: "Adam Noto Hakarsa",
          icon: { image: RiUserSmileLine },
        },
        {
          caption: "Alim Naufal",
          icon: { image: RiUserStarLine },
        },
        {
          caption: "Michael Chen",
          icon: { image: RiUserLine },
        },
        {
          caption: "Ayu Pratama",
          icon: { image: RiUserHeartLine },
        },
        {
          caption: "Daniel Rodriguez",
          icon: { image: RiUserVoiceLine },
        },
        {
          caption: "Rina Sari",
          icon: { image: RiUserSettingsLine },
        },
        {
          caption: "Tom Williams",
          icon: { image: RiUserSharedLine },
        },
        {
          caption: "Nabila Zahra",
          icon: { image: RiUserSearchLine },
        },
        {
          caption: "Kevin Park",
          icon: { image: RiUserAddLine },
        },
      ];

      function SearchboxWithList() {
        const [searchValue, setSearchValue] = useState("");
        const [people] = useState(PEOPLE_MENU);

        const filteredContent = useMemo(() => {
          const search = searchValue.toLowerCase();
          return people
            .filter((props) => props.caption.toLowerCase().includes(search))
            .map((props) => ({
              ...props,
              onClick: () => setSearchValue(props.caption),
            }));
        }, [searchValue, people]);

        return (
          <Searchbox
            value={searchValue}
            showResultMenu
            resultMenu={({ list }) => list(filteredContent)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        );
      }

      it("render all list people", () => {
        cy.mount(<SearchboxWithList />);

        cy.findByLabelText("textbox-search").type("Alim");

        PEOPLE_MENU.map((props) => {
          if (props.caption !== "Alim Naufal") {
            cy.findByText(props.caption).should("not.exist");
          } else {
            cy.findByText(props.caption).should("exist");
          }
        });
      });

      context("when clicking the list", () => {
        it("render with selected", () => {
          cy.mount(<SearchboxWithList />);

          cy.findByLabelText("textbox-search").type("Alim");

          PEOPLE_MENU.map((props) => {
            if (props.caption !== "Alim Naufal") {
              cy.findByText(props.caption).should("not.exist");
            } else {
              cy.findByText(props.caption).should("exist").click();
            }
          });

          cy.findByLabelText("textbox-search").should(
            "have.value",
            "Alim Naufal"
          );
        });
      });
    });

    context("render", () => {
      interface CourseItemProps {
        title: string;
        subtitle?: string;
        items: {
          taken?: boolean;
          title: string;
          category: string;
          author: string;
        }[];
      }

      const COURSE_ITEMS: CourseItemProps[] = [
        {
          title: "Tech Articles",
          subtitle: "Curated articles on web tech trends",
          items: [
            {
              title: "Understanding React 18",
              category: "Frontend",
              author: "Systatum",
              taken: true,
            },
            {
              title: "TypeScript Deep Dive",
              category: "Backend",
              author: "Pluralsight",
              taken: false,
            },
            {
              title: "Async Patterns in JS",
              category: "Frontend",
              author: "Egghead",
              taken: true,
            },
            {
              title: "Clean Code Practices",
              category: "General",
              author: "Coursera",
              taken: false,
            },
            {
              title: "Intro to WebAssembly",
              category: "Experimental",
              author: "Systatum",
              taken: false,
            },
          ],
        },
        {
          title: "Online Courses",
          subtitle: "Popular tech courses this month",
          items: [
            {
              title: "React & Redux Bootcamp",
              category: "Frontend",
              author: "Coursera",
              taken: false,
            },
            {
              title: "Docker Essentials",
              category: "DevOps",
              author: "Pluralsight",
              taken: true,
            },
            {
              title: "Fullstack with Node.js",
              category: "Backend",
              author: "Egghead",
              taken: false,
            },
            {
              title: "GraphQL Mastery",
              category: "API",
              author: "Systatum",
              taken: true,
            },
            {
              title: "Design Systems",
              category: "UI/UX",
              author: "Coursera",
              taken: false,
            },
          ],
        },
        {
          title: "Open Source Tools",
          subtitle: "Top GitHub projects by community",
          items: [
            {
              title: "Vite",
              category: "Frontend",
              author: "Systatum",
              taken: false,
            },
            {
              title: "Zod",
              category: "Validation",
              author: "Egghead",
              taken: true,
            },
            {
              title: "tRPC",
              category: "API",
              author: "Coursera",
              taken: false,
            },
            {
              title: "Remix",
              category: "Fullstack",
              author: "Pluralsight",
              taken: true,
            },
            {
              title: "Nx",
              category: "Monorepo",
              author: "Systatum",
              taken: false,
            },
          ],
        },
      ];

      function SearchboxWithRender() {
        const [searchValue, setSearchValue] = useState("");
        const [courses] = useState(COURSE_ITEMS);
        const [isFocus, setIsFocus] = useState(false);

        const filteredRows = useMemo(() => {
          const search = searchValue.toLowerCase();

          return courses
            .map((props) => {
              const filteredItems = props.items.filter(
                (item) =>
                  item.title.toLowerCase().includes(search) ||
                  item.category.toLowerCase().includes(search) ||
                  item.author.toLowerCase().includes(search)
              );

              return {
                ...props,
                items: filteredItems,
              };
            })
            .filter((group) => group.items.length > 0);
        }, [searchValue, courses]);

        const allItems = filteredRows.flatMap((section) => section.items);

        const courseItems = Array.from(
          new Set(allItems.map((item) => item.title))
        ).map((title) => ({
          id: title,
          title: title,
        }));

        const authorItems = Array.from(
          new Set(allItems.map((item) => item.author))
        ).map((author) => ({
          id: author,
          title: author,
        }));

        const SearchSubMenu = () => {
          return (
            <List
              styles={{
                containerStyle: css`
                  min-width: 300px;
                  padding: 20px;
                  background-color: white;
                  border-radius: 4px;
                  border: 1px solid #bcb9b9;
                `,
              }}
            >
              <List.Group key={"course"} id={"course"} title={"Course"}>
                {courseItems.map((item) => (
                  <List.Item
                    onMouseDown={async () => {
                      await setIsFocus(false);
                      await setSearchValue(item.title);
                    }}
                    key={item.title}
                    id={item.title}
                    title={item.title}
                  />
                ))}
              </List.Group>
              <List.Group key={"author"} id={"author"} title={"Author"}>
                {authorItems.map((item) => (
                  <List.Item
                    onMouseDown={async () => {
                      await setIsFocus(false);
                      await setSearchValue(item.title);
                    }}
                    key={item.title}
                    id={item.title}
                    title={item.title}
                  />
                ))}
              </List.Group>
            </List>
          );
        };

        return (
          <Searchbox
            value={searchValue}
            showResultMenu={isFocus}
            onMouseDown={() => setIsFocus(true)}
            resultMenu={({ render }) => render(<SearchSubMenu />)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        );
      }

      context("when given with our List component", () => {
        it("render all list people", () => {
          cy.mount(<SearchboxWithRender />);

          cy.findByLabelText("textbox-search").type("Systa");

          COURSE_ITEMS.map((group) =>
            group.items.map((props) => {
              if (props.author !== "Systatum") {
                cy.findByText(props.author).should("not.exist");
              } else {
                cy.findByText(props.author).should("exist");
              }
            })
          );
        });
      });
    });

    context("show", () => {
      function SearchboxWithShow() {
        const Drawer = () => {
          return <>This is with show</>;
        };

        return (
          <Searchbox
            showResultMenu
            resultMenu={({ show }) => show(<Drawer />, { withArrow: true })}
          />
        );
      }

      it("render with Tooltip container", () => {
        cy.mount(<SearchboxWithShow />);

        cy.findByLabelText("textbox-search").click();
        cy.findByText("This is with show").should("be.visible");
        cy.findByLabelText("tooltip-arrow")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(128, 128, 128)");
        cy.findByLabelText("tooltip-drawer")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(75, 85, 99)");
      });
    });
  });

  context("deletion", () => {
    context("when clicking", () => {
      it("calls onChange with an empty value", () => {
        cy.mount(
          <Searchbox
            value="Alimnfl"
            onChange={(e) => console.log(`the value is ${e.target.value}`)}
          />
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByLabelText("delete-input").click();
        cy.get("@consoleLog").should("have.been.calledWith", "the value is ");
      });

      it("should keep focus on the searchbox", () => {
        cy.mount(
          <Searchbox
            value="Alimnfl"
            onChange={(e) => console.log(`the value is ${e.target.value}`)}
          />
        );

        cy.findByLabelText("textbox-search").click().should("be.focused");
        cy.findByLabelText("delete-input").click();
        cy.findByLabelText("textbox-search").should("be.focused");
      });
    });
  });
});

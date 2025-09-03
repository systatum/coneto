import {
  RiArrowUpSLine,
  RiClipboardFill,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
} from "@remixicon/react";
import { ColumnTableProps, Table } from "./../../components/table";
import { TipMenuItemProps } from "./../../components/tip-menu";
import { css } from "styled-components";

interface TableItemProps {
  title: string;
  subtitle?: string;
  items: { title: string; category: string; author: string }[];
}

describe("Table", () => {
  const TABLE_ITEMS: TableItemProps[] = [
    {
      title: "Tech Articles",
      subtitle: "Curated articles on web tech trends",
      items: [
        {
          title: "Understanding React 18",
          category: "Frontend",
          author: "John Doe",
        },
        {
          title: "TypeScript Deep Dive",
          category: "Backend",
          author: "Jane Smith",
        },
        {
          title: "Async Patterns in JS",
          category: "Frontend",
          author: "Ali Rahman",
        },
        {
          title: "Clean Code Practices",
          category: "General",
          author: "Nina Hart",
        },
        {
          title: "Intro to WebAssembly",
          category: "Experimental",
          author: "Tom K.",
        },
        {
          title: "Rust for JavaScript Devs",
          category: "Backend",
          author: "Lia Wang",
        },
        {
          title: "Next.js Performance Tips",
          category: "Frontend",
          author: "Hugo Lin",
        },
        {
          title: "Database Indexing 101",
          category: "Backend",
          author: "Sara Lee",
        },
        {
          title: "Scaling with Redis",
          category: "DevOps",
          author: "David Kim",
        },
        { title: "AI in the Browser", category: "AI/ML", author: "Zara T." },
      ],
    },
    {
      title: "Online Courses",
      subtitle: "Popular tech courses this month",
      items: [
        {
          title: "React & Redux Bootcamp",
          category: "Frontend",
          author: "Codecademy",
        },
        {
          title: "Docker Essentials",
          category: "DevOps",
          author: "Pluralsight",
        },
        {
          title: "Fullstack with Node.js",
          category: "Backend",
          author: "Udemy",
        },
        {
          title: "GraphQL Mastery",
          category: "API",
          author: "Frontend Masters",
        },
        {
          title: "Design Systems",
          category: "UI/UX",
          author: "Figma Academy",
        },
        {
          title: "AI with TensorFlow.js",
          category: "AI/ML",
          author: "Coursera",
        },
        {
          title: "Intro to TypeScript",
          category: "Frontend",
          author: "FreeCodeCamp",
        },
        {
          title: "AWS Lambda in Practice",
          category: "Cloud",
          author: "Egghead.io",
        },
        {
          title: "Security for Developers",
          category: "Security",
          author: "HackerOne",
        },
        {
          title: "Building Design Tools",
          category: "DevTools",
          author: "ToolingLab",
        },
      ],
    },
    {
      title: "Open Source Tools",
      subtitle: "Top GitHub projects by community",
      items: [
        { title: "Vite", category: "Frontend", author: "Evan You" },
        { title: "Zod", category: "Validation", author: "Colin McDonnell" },
        { title: "tRPC", category: "API", author: "Julian Fahrer" },
        { title: "Remix", category: "Fullstack", author: "Remix Team" },
        { title: "Nx", category: "Monorepo", author: "Nrwl" },
        { title: "SWR", category: "Data Fetching", author: "Vercel" },
        {
          title: "Drizzle ORM",
          category: "Database",
          author: "Drizzle Team",
        },
        { title: "Playwright", category: "Testing", author: "Microsoft" },
        { title: "Astro", category: "Static Site", author: "Astro Team" },
        { title: "React Hook Form", category: "Forms", author: "Bluebill" },
      ],
    },
  ];

  const TOP_ACTIONS = [
    {
      title: "Delete",
      icon: RiDeleteBin2Line,
      onClick: () => {
        console.log("Delete clicked");
      },
    },
    {
      title: "Copy",
      icon: RiClipboardFill,
      onClick: () => {
        console.log("Copy clicked");
      },
    },
  ];

  const columns: ColumnTableProps[] = [
    {
      caption: "Title",
      sortable: true,
      width: "45%",
    },
    {
      caption: "Category",
      sortable: true,
      width: "30%",
    },
    {
      caption: "Author",
      sortable: true,
      width: "25%",
    },
  ];

  const rows = TABLE_ITEMS;

  const ROW_ACTION = (rowId: string): TipMenuItemProps[] => {
    return [
      {
        caption: "Edit",
        icon: RiArrowUpSLine,
        iconColor: "gray",
        onClick: () => {
          console.log(`${rowId} was edited`);
        },
      },
      {
        caption: "Delete",
        icon: RiDeleteBin2Fill,
        iconColor: "gray",
        onClick: () => {
          console.log(`${rowId} was deleted`);
        },
      },
    ];
  };

  context("with searchable", () => {
    context("when there are action buttons and right-side info panel", () => {
      it("renders searchbox the middle", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
          >
            {rows?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });
    context("when there is only right-side info panel", () => {
      it("renders searchbox in the left side", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            searchable
          >
            {rows?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });

    context("When there is action buttons and no right-side panel", () => {
      it("renders searchbox in the right side", () => {
        cy.mount(
          <Table
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
          >
            {rows?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });

    context("When there is no action buttons and no right-side panel", () => {
      it("renders searchbox in the all row", () => {
        cy.mount(
          <Table
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            searchable
          >
            {rows?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });
  });
});

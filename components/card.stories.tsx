import { Card } from "./card";
import { Meta, StoryObj } from "@storybook/react";
import {
  RiSpam2Line,
  RiErrorWarningLine,
  RiShieldLine,
  RiCheckDoubleLine,
  RiInboxArchiveLine,
  RiDownload2Line,
  RiLinkM,
  RiSendPlane2Line,
  RiEdit2Line,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiRefreshLine,
  RiAddBoxLine,
} from "@remixicon/react";
import { Toolbar, ToolbarSubMenuProps } from "./toolbar";
import { Searchbox } from "./searchbox";
import { ChangeEvent, useMemo, useState } from "react";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { List, ListGroupContentProps, ListItemProps } from "./list";
import { css } from "styled-components";
import { ColumnTableProps, SubMenuListTableProps, Table } from "./table";
import { DormantText } from "./dormant-text";
import { Textbox } from "./textbox";

const meta: Meta<typeof Card> = {
  title: "Content/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    shadow: {
      control: {
        type: "select",
        options: ["none", "sm", "md", "lg", "xl", "2xl"],
      },
      description: "Shadow size",
      defaultValue: "sm",
    },
    radius: {
      control: {
        type: "select",
        options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
      },
      description: "Border radius",
      defaultValue: "xs",
    },
    padding: {
      control: {
        type: "select",
        options: [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
        ],
      },
      description: "Padding size",
      defaultValue: "sm",
    },
    styles: {
      containerStyle: {
        control: "text",
        description: "Additional custom container classes",
      },
      headerStyle: {
        control: "text",
        description: "Additional custom title classes",
      },
      footerStyle: {
        control: "text",
        description: "Additional custom footer classes",
      },
    },
    title: {
      control: "text",
      description: "Additional for title content",
    },
    children: {
      control: "text",
      description: "Card content",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
  },
  render: () => {
    const SUB_MENU_LIST: ToolbarSubMenuProps[] = [
      {
        caption: "Report Phishing",
        icon: { image: RiSpam2Line, color: "blue" },
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: { image: RiErrorWarningLine, color: "red" },
        onClick: () => console.log("Junk reported"),
      },
      {
        caption: "Block Sender",
        icon: { image: RiShieldLine, color: "orange" },
        isDangerous: true,
        onClick: () => console.log("Sender blocked"),
      },
      {
        caption: "Mark as Read",
        icon: { image: RiCheckDoubleLine, color: "green" },
        onClick: () => console.log("Marked as read"),
      },
      {
        caption: "Move to Spam",
        icon: { image: RiInboxArchiveLine, color: "purple" },
        onClick: () => console.log("Moved to spam"),
      },
      {
        caption: "Download Attachment",
        icon: { image: RiDownload2Line, color: "teal" },
        onClick: () => console.log("Downloading"),
      },
      {
        caption: "Copy Link",
        icon: { image: RiLinkM, color: "gray" },
        onClick: () => console.log("Link copied"),
      },
      {
        caption: "Share",
        icon: { image: RiSendPlane2Line, color: "indigo" },
        isDangerous: true,
        onClick: () => console.log("Shared"),
      },
      {
        caption: "Edit",
        icon: { image: RiEdit2Line, color: "yellow" },
        onClick: () => console.log("Edit mode"),
      },
    ];

    return (
      <Card>
        <Toolbar>
          <Toolbar.Menu
            caption="Default"
            icon={{ image: RiSpam2Line, color: "red" }}
            subMenuList={SUB_MENU_LIST}
          />

          <Toolbar.Menu
            caption="Primary"
            variant="primary"
            icon={{ image: RiSpam2Line, color: "white" }}
            subMenuList={SUB_MENU_LIST}
          />

          <Toolbar.Menu
            caption="Danger"
            variant="danger"
            icon={{ image: RiSpam2Line, color: "white" }}
            subMenuList={SUB_MENU_LIST}
          />
        </Toolbar>
      </Card>
    );
  },
};

export const WithHeader: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
    title: "Import dishes",
  },
  render: (args) => {
    interface RestaurantDish {
      name: string;
      image: string;
      price: string;
      theme: string;
    }

    const RESTAURANT_DISHES: RestaurantDish[] = [
      {
        name: "French Toast",
        image: "https://picsum.photos/seed/frenchtoast/200",
        price: "13$",
        theme: "Breakfast",
      },
      {
        name: "Sushi Deluxe",
        image: "https://picsum.photos/seed/sushi/200",
        price: "22$",
        theme: "Japanese",
      },
      {
        name: "Pad Thai",
        image: "https://picsum.photos/seed/padthai/200",
        price: "15$",
        theme: "Thai",
      },
      {
        name: "Tacos Al Pastor",
        image: "https://picsum.photos/seed/tacos/200",
        price: "12$",
        theme: "Mexican",
      },
      {
        name: "Margherita Pizza",
        image: "https://picsum.photos/seed/pizza/200",
        price: "18$",
        theme: "Italian",
      },
      {
        name: "Butter Chicken",
        image: "https://picsum.photos/seed/butterchicken/200",
        price: "16$",
        theme: "Indian",
      },
      {
        name: "Pho Bo",
        image: "https://picsum.photos/seed/phobo/200",
        price: "14$",
        theme: "Vietnamese",
      },
      {
        name: "Croissant & Coffee",
        image: "https://picsum.photos/seed/croissant/200",
        price: "10$",
        theme: "French",
      },
      {
        name: "Cheeseburger",
        image: "https://picsum.photos/seed/cheeseburger/200",
        price: "11$",
        theme: "American",
      },
      {
        name: "Falafel Wrap",
        image: "https://picsum.photos/seed/falafel/200",
        price: "13$",
        theme: "Middle Eastern",
      },
    ];

    const [value, setValue] = useState({
      search: "",
      checked: [] as RestaurantDish[],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter(
                (val: RestaurantDish) => val.name !== parsed.name
              ),
        }));
      } else {
        setValue((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();
      return RESTAURANT_DISHES.filter((dish) =>
        dish.name.toLowerCase().includes(searchContent)
      );
    }, [value.search]);

    return (
      <Card
        {...args}
        styles={{
          containerStyle: css`
            padding: 0px;
          `,
          headerStyle: css`
            border-bottom: 1px solid #d1d5db;
          `,
        }}
      >
        <div
          style={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            minWidth: "500px",
          }}
        >
          <Searchbox
            name="search"
            onChange={onChangeValue}
            value={value.search}
            placeholder="Search..."
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            {filteredContent.map((dish, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Checkbox
                    onChange={onChangeValue}
                    value={JSON.stringify(dish)}
                    checked={value.checked.some(
                      (item) => item.name === dish.name
                    )}
                    name="checked"
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "30px",
                      borderRadius: "0.125rem",
                      overflow: "hidden",
                    }}
                  >
                    <img src={dish.image} />
                  </div>
                  <h3>{dish.name}</h3>
                </div>
                <span>{dish.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  },
};

export const WithHeaderAndFooter: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "breakfast",
        title: "Breakfast",
        items: [
          {
            id: "1",
            title: "French Toast",
            subtitle: "Breakfast",
            imageUrl: "https://picsum.photos/seed/frenchtoast/200",
            rightSideContent: [<span>13$</span>],
          },
          {
            id: "2",
            title: "Croissant & Coffee",
            subtitle: "French",
            imageUrl: "https://picsum.photos/seed/croissant/200",
            rightSideContent: [<span>10$</span>],
          },
          {
            id: "3",
            title: "Sushi Deluxe",
            subtitle: "Japanese",
            imageUrl: "https://picsum.photos/seed/sushi/200",
            rightSideContent: [<span>22$</span>],
          },
          {
            id: "4",
            title: "Pad Thai",
            subtitle: "Thai",
            imageUrl: "https://picsum.photos/seed/padthai/200",
            rightSideContent: [<span>15$</span>],
          },
          {
            id: "5",
            title: "Tacos Al Pastor",
            subtitle: "Mexican",
            imageUrl: "https://picsum.photos/seed/tacos/200",
            rightSideContent: [<span>12$</span>],
          },
        ],
      },
      {
        id: "international-dishes",
        title: "International Dishes",
        items: [
          {
            id: "6",
            title: "Margherita Pizza",
            subtitle: "Italian",
            imageUrl: "https://picsum.photos/seed/pizza/200",
            rightSideContent: [<span>18$</span>],
          },
          {
            id: "7",
            title: "Butter Chicken",
            subtitle: "Indian",
            imageUrl: "https://picsum.photos/seed/butterchicken/200",
            rightSideContent: [<span>16$</span>],
          },
          {
            id: "8",
            title: "Pho Bo",
            subtitle: "Vietnamese",
            imageUrl: "https://picsum.photos/seed/phobo/200",
            rightSideContent: [<span>14$</span>],
          },
          {
            id: "9",
            title: "Cheeseburger",
            subtitle: "American",
            imageUrl: "https://picsum.photos/seed/cheeseburger/200",
            rightSideContent: [<span>11$</span>],
          },
          {
            id: "10",
            title: "Falafel Wrap",
            subtitle: "Middle Eastern",
            imageUrl: "https://picsum.photos/seed/falafel/200",
            rightSideContent: [<span>13$</span>],
          },
        ],
      },
    ];

    const [groups, setGroups] = useState(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
      checked: [] as ListItemProps[],
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter(
            (item) =>
              (item.title as string)?.toLowerCase().includes(searchContent) ||
              item.subtitle?.toLowerCase().includes(searchContent)
          );

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [value.search, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter((val: ListItemProps) => val.id !== parsed.id),
        }));
      } else {
        setValue((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const reorderItems = (
      oldPosition: number,
      newPosition: number,
      oldGroupId: string,
      newGroupId: string
    ) => {
      if (oldGroupId === newGroupId) {
        return groups.map((group) => {
          if (group.id !== oldGroupId) return group;

          const newItems = [...group.items];
          const [movedItem] = newItems.splice(oldPosition, 1);
          newItems.splice(newPosition, 0, movedItem);

          return {
            ...group,
            items: newItems,
          };
        });
      }

      const itemToMove = groups.find((group) => group.id === oldGroupId)?.items[
        oldPosition
      ];
      if (!itemToMove) return groups;

      return groups.map((group) => {
        if (group.id === oldGroupId) {
          const newItems = group.items.filter(
            (_, index) => index !== oldPosition
          );
          return { ...group, items: newItems };
        }

        if (group.id === newGroupId) {
          const newItems = [...group.items];
          newItems.splice(newPosition, 0, itemToMove);
          return { ...group, items: newItems };
        }

        return group;
      });
    };

    const onDragged = ({
      oldPosition,
      newPosition,
      oldGroupId,
      newGroupId,
    }: {
      oldPosition: number;
      newPosition: number;
      oldGroupId: string;
      newGroupId: string;
    }) => {
      const updatedGroups = reorderItems(
        oldPosition,
        newPosition,
        oldGroupId,
        newGroupId
      );

      setGroups(updatedGroups);
    };

    const DataItems = filteredContent.flatMap((data) => data.items);

    const ContentCard = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                setValue((prev) => ({ ...prev, checked: DataItems }));
              } else {
                setValue((prev) => ({ ...prev, checked: [] }));
              }
            }}
            checked={value.checked.length === DataItems.length}
            indeterminate={
              value.checked.length > 0 &&
              value.checked.length < DataItems.length
            }
          />
          <span>Select all ({value.checked.length})</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
          }}
        >
          <Button>Cancel</Button>
          <Button variant="primary">Import</Button>
        </div>
      </div>
    );

    return (
      <Card
        title="Systatum Food Services"
        subtitle="Fueling innovation with every bite."
        headerActions={[
          {
            caption: "Edit fields",
            disabled: value.checked.length === 0,
            icon: { image: RiEdit2Line },
            onClick: () => {
              console.log(`Delete ${value.checked.length} clicked`);
            },
          },
        ]}
        styles={{
          containerStyle: css`
            padding-left: 0px;
            padding-right: 0px;
          `,
          headerStyle: css`
            padding-left: 15px;
            padding-right: 15px;
            border-bottom: 1px solid #d1d5db;
          `,
          footerStyle: css`
            padding-left: 20px;
            padding-right: 20px;
            border-top: 1px solid #d1d5db;
          `,
        }}
        footerContent={ContentCard}
      >
        <List
          searchable
          selectable
          draggable
          onDragged={onDragged}
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 400px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    groupId={group.id}
                    styles={list.styles}
                    id={list.id}
                    subtitle={list.subtitle}
                    title={list.title}
                    imageUrl={list.imageUrl}
                    onClick={() => {
                      const isAlreadyChecked = value.checked.some(
                        (check) => check.id.toString() === list.id.toString()
                      );

                      onChangeValue({
                        target: {
                          name: "checked",
                          value: JSON.stringify({
                            id: list.id,
                            title: list.title,
                            subtitle: list.subtitle,
                          }),
                          type: "checkbox",
                          checked: !isAlreadyChecked,
                        },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    rightSideContent={list.rightSideContent}
                    onSelected={onChangeValue}
                    selectedOptions={{
                      checked: value.checked.some(
                        (check) => check.id.toString() === list.id.toString()
                      ),
                      value: JSON.stringify({
                        id: list.id,
                        title: list.title,
                        subtitle: list.subtitle,
                      }),
                    }}
                  />
                ))}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const WithFullWidthContent: Story = {
  render: () => {
    const [value, setValue] = useState({
      title: "Department",
      subtitle: "Departments and their leaders",
    });
    const [oldValue, setOldValue] = useState({
      title: value.title,
      subtitle: value.subtitle,
    });

    const columns: ColumnTableProps[] = [
      {
        id: "name",
        caption: "Name",
        sortable: true,
      },
      {
        id: "code",
        caption: "Code",
        sortable: true,
      },
      {
        id: "lead",
        caption: "Lead",
        sortable: true,
      },
      {
        id: "members",
        caption: "Members",
        sortable: true,
      },
    ];

    const DEPARTMENTS = [
      {
        name: "Executive Office",
        code: "EXE",
        lead: "Adam Hakarsa",
        members: "3",
      },
      {
        name: "Engineering Department",
        code: "ENG",
        lead: "Mohamad Naufal Alim",
        members: "15",
      },
      {
        name: "Human Resources Department",
        code: "HRD",
        lead: "Aisha Rahman",
        members: "6",
      },
      {
        name: "Finance Department",
        code: "FIN",
        lead: "Budi Santoso",
        members: "8",
      },
      {
        name: "Marketing Department",
        code: "MKT",
        lead: "Nadia Putri",
        members: "10",
      },
      {
        name: "Product Department",
        code: "PRD",
        lead: "Rizky Setiawan",
        members: "7",
      },
      {
        name: "Customer Success Department",
        code: "CSD",
        lead: "Tania Lestari",
        members: "5",
      },
      {
        name: "Operations Department",
        code: "OPS",
        lead: "Dimas Saputra",
        members: "9",
      },
      {
        name: "Legal Department",
        code: "LGL",
        lead: "Anita Kusuma",
        members: "4",
      },
      {
        name: "IT Support Department",
        code: "IT",
        lead: "Fajar Nugroho",
        members: "12",
      },
    ];

    const [rows, setRows] = useState(DEPARTMENTS);

    type DepartmentKeys = keyof (typeof DEPARTMENTS)[number];

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: DepartmentKeys;
    }) => {
      if (mode === "original") {
        setRows([...DEPARTMENTS]);
        return;
      }

      const sorted = [...rows].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        return typeof aVal === "string" && typeof bVal === "string"
          ? mode === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
          : 0;
      });

      setRows(sorted);
    };

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
    };

    const TIP_MENU_ACTION = (
      columnCaption: DepartmentKeys
    ): SubMenuListTableProps[] => {
      return [
        {
          caption: "Sort Ascending",
          icon: { image: RiArrowUpSLine, color: "gray" },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column: columnCaption });
          },
        },
        {
          caption: "Sort Descending",
          icon: { image: RiArrowDownSLine, color: "gray" },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column: columnCaption });
          },
        },
        {
          caption: "Reset Sorting",
          icon: { image: RiRefreshLine, color: "gray" },
          onClick: () => {
            handleSortingRequested({ mode: "original", column: columnCaption });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: { image: RiEdit2Line, color: "gray" },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
      ];
    };

    const renderDormantTextField = (
      name: "title" | "subtitle",
      sizeText?: number
    ) => {
      return (
        <DormantText
          acceptChangeOn={"enter"}
          content={value?.[name]}
          cancelable
          onActive={() => {
            setOldValue(value);
          }}
          styles={{
            dormantedStyle: css`
              padding: 0px;
            `,
          }}
          dormantedFontSize={sizeText ?? 16}
          onCancelRequested={() => {
            setValue((prev) => ({ ...prev, [name]: oldValue.title }));
          }}
        >
          <Textbox
            value={value?.[name]}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [name]: e.target.value }))
            }
          />
        </DormantText>
      );
    };

    return (
      <Card
        title={renderDormantTextField("title")}
        subtitle={renderDormantTextField("subtitle", 14)}
        styles={{
          titleStyle: css`
            width: 100%;
          `,
          textContainerStyle: css`
            width: 100%;
          `,
          containerStyle: css`
            padding-left: 0px;
            padding-right: 0px;
            min-width: 1000px;
            padding-bottom: 0px;
          `,
          headerStyle: css`
            padding-left: 15px;
            padding-right: 15px;
            border-bottom: 1px solid #d1d5db;
          `,
        }}
        headerActions={[
          {
            caption: "Add",
            icon: { image: RiAddBoxLine },
            onClick: () => {
              console.log(`Add button was clicked`);
            },
          },
        ]}
      >
        <Table
          selectable
          styles={{
            tableRowContainerStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          labels={{ totalSelectedItemText: (n) => `${n} Department selected` }}
        >
          {rows.map((rowValue, rowIndex) => (
            <Table.Row
              onClick={({ toggleCheckbox }) => {
                console.log(
                  `Selected to this ${`${rowValue.name}-${rowValue.code}-${rowValue.lead}-${rowValue.members}`}`
                );
                toggleCheckbox();
              }}
              key={rowIndex}
              rowId={`${rowValue.name}-${rowValue.code}-${rowValue.lead}-${rowValue.members}`}
              actions={ROW_ACTION}
              content={[
                rowValue.name,
                rowValue.code,
                rowValue.lead,
                rowValue.members,
              ]}
            />
          ))}
        </Table>
      </Card>
    );
  },
};

export const Toggleable: Story = {
  render: () => {
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(true);

    const sortRows = <T,>(
      rows: T[],
      original: T[],
      mode: "asc" | "desc" | "original",
      column: keyof T
    ): T[] => {
      if (mode === "original") return [...original];

      return [...rows].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return mode === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return 0;
      });
    };

    const renderTable = <T extends Record<string, any>>({
      columns,
      rows,
      setRows,
      originalData,
      getRowId,
    }: {
      columns: ColumnTableProps[];
      rows: T[];
      setRows: React.Dispatch<React.SetStateAction<T[]>>;
      originalData: T[];
      getRowId: (row: T) => string;
    }) => {
      const handleSorting = ({
        mode,
        column,
      }: {
        mode: "asc" | "desc" | "original";
        column: keyof T;
      }) => {
        const sorted = sortRows(rows, originalData, mode, column);
        setRows(sorted);
      };

      const tipMenu = (column: keyof T): SubMenuListTableProps[] => [
        {
          caption: "Sort Ascending",
          icon: { image: RiArrowUpSLine, color: "gray" },
          onClick: () => handleSorting({ mode: "asc", column }),
        },
        {
          caption: "Sort Descending",
          icon: { image: RiArrowDownSLine, color: "gray" },
          onClick: () => handleSorting({ mode: "desc", column }),
        },
        {
          caption: "Reset Sorting",
          icon: { image: RiRefreshLine, color: "gray" },
          onClick: () => handleSorting({ mode: "original", column }),
        },
      ];

      return (
        <Table
          styles={{
            tableRowContainerStyle: css`
              max-height: 160px;
            `,
          }}
          selectable
          columns={columns}
          subMenuList={tipMenu}
        >
          {rows.map((row, index) => (
            <Table.Row
              key={index}
              rowId={getRowId(row)}
              content={columns.map((col) => row[col.id])}
            />
          ))}
        </Table>
      );
    };

    const DEPARTMENTS = [
      {
        departmentName: "Excecutive",
        head: "Adam Hakarsa",
        employeeCount: "25",
        budget: "$1,020,000",
      },
      {
        departmentName: "Engineering",
        head: "Alim Naufal",
        employeeCount: "12",
        budget: "$100,000",
      },
      {
        departmentName: "Human Resources",
        head: "Rizky Pratama",
        employeeCount: "8",
        budget: "$30,000",
      },
      {
        departmentName: "Finance",
        head: "Aira Amira Fairuz",
        employeeCount: "6",
        budget: "$60,000",
      },
      {
        departmentName: "Customer Support",
        head: "Dewi Lestari",
        employeeCount: "15",
        budget: "$50,000",
      },
    ];

    const departmentColumns: ColumnTableProps[] = [
      { id: "departmentName", caption: "Department", sortable: true },
      { id: "head", caption: "Department Head", sortable: true },
      { id: "employeeCount", caption: "Employees", sortable: true },
      { id: "budget", caption: "Annual Budget", sortable: true },
    ];

    const [departmentRows, setDepartmentRows] = useState(DEPARTMENTS);

    const ASSETS = [
      {
        assetName: "MacBook Pro M4",
        category: "Laptop",
        assignedTo: "Adam Hakarsa",
        condition: "Excellent",
      },
      {
        assetName: "MacBook Pro M3",
        category: "Laptop",
        assignedTo: "Alim Naufal",
        condition: "Excellent",
      },
      {
        assetName: "iPhone 15",
        category: "Mobile Device",
        assignedTo: "Siti Azzahra",
        condition: "Excellent",
      },
      {
        assetName: "Ergonomic Chair",
        category: "Furniture",
        assignedTo: "Gunawan Saputra",
        condition: "Good",
      },
      {
        assetName: "Meeting Room Projector",
        category: "Equipment",
        assignedTo: "Shared",
        condition: "Needs Maintenance",
      },
    ];

    const assetColumns: ColumnTableProps[] = [
      { id: "assetName", caption: "Asset Name", sortable: true },
      { id: "category", caption: "Category", sortable: true },
      { id: "assignedTo", caption: "Assigned To", sortable: true },
      { id: "condition", caption: "Condition", sortable: true },
    ];

    const [assetRows, setAssetRows] = useState(ASSETS);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          padding: "16px",
        }}
      >
        <Card
          title="Toggleable without actions"
          subtitle="Organizational Structure"
          toggleable
          open={isOpen1}
          onToggleChange={setIsOpen1}
          styles={{
            containerStyle: css`
              padding-left: 0px;
              padding-right: 0px;
              min-width: 1000px;
              padding-bottom: 0px;
            `,
            headerStyle: css`
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #d1d5db;
            `,
          }}
        >
          {renderTable({
            columns: departmentColumns,
            rows: departmentRows,
            setRows: setDepartmentRows,
            originalData: DEPARTMENTS,
            getRowId: (row) => row.departmentName,
          })}
        </Card>

        <Card
          title="Toggleable with actions"
          subtitle="Asset Inventory Management"
          toggleable
          open={isOpen2}
          onToggleChange={setIsOpen2}
          headerActions={[
            {
              caption: "Add",
              icon: { image: RiAddBoxLine },
              onClick: () => {
                console.log(`Add button was clicked`);
              },
            },
            {
              caption: "Archive",
              icon: { image: RiInboxArchiveLine },
              onClick: () => {
                console.log(`Archive button was clicked`);
              },
            },
          ]}
          styles={{
            containerStyle: css`
              padding-left: 0px;
              padding-right: 0px;
              min-width: 1000px;
              padding-bottom: 0px;
            `,
            headerStyle: css`
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #d1d5db;
            `,
          }}
        >
          {renderTable({
            columns: assetColumns,
            rows: assetRows,
            setRows: setAssetRows,
            originalData: ASSETS,
            getRowId: (row) => row.assetName,
          })}
        </Card>
      </div>
    );
  },
};

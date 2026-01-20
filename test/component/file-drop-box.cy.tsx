import { css } from "styled-components";
import {
  FileDropBox,
  OnCompleteFunctionProps,
  OnFileDroppedFunctionProps,
} from "./../../components/file-drop-box";
import { Table } from "./../../components/table";
import { useState } from "react";
import { RiDeleteBin2Fill } from "@remixicon/react";

describe("FileDropBox", () => {
  context("children", () => {
    context("when click on the children area", () => {
      function FileDropBoxContent() {
        const [files, setFiles] = useState<File[]>([]);

        const onFileDropped = async ({
          error,
          files,
          setProgressLabel,
          succeed,
        }: OnFileDroppedFunctionProps) => {
          const file = files[0];
          setFiles((prev) => [...prev, file]);
          setProgressLabel(`Uploading ${file.name}`);

          return new Promise<void>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
              progress += 20;

              if (progress >= 100) {
                clearInterval(interval);
                if (file === null) {
                  error(file, `file ${file.name} is not uploaded`);
                } else {
                  succeed(file);
                }
                setProgressLabel(`Uploaded ${files[0].name}`);
                resolve();
              }
            }, 300);
          });
        };

        const onComplete = async ({
          failedFiles,
          setProgressLabel,
          succeedFiles,
          hideProgressLabel,
          showUploaderForm,
        }: OnCompleteFunctionProps) => {
          console.log(succeedFiles, "This is succeedFiles");
          console.log(failedFiles, "This is failedFiles");
          await setProgressLabel(
            `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
          );
          await hideProgressLabel();
          await showUploaderForm();
        };

        return (
          <FileDropBox onFileDropped={onFileDropped} onComplete={onComplete}>
            <Table
              styles={{
                containerStyle: css`
                  ${files.length === 0 &&
                  css`
                    display: none;
                  `}
                `,
              }}
              columns={[
                {
                  id: "file_name",
                  caption: "File Name",
                },
                {
                  id: "date",
                  caption: "Date",
                },
              ]}
            >
              {files.map((props) => (
                <Table.Row
                  actions={(id) => [
                    {
                      caption: "Delete",
                      icon: RiDeleteBin2Fill,
                      onClick: () => {
                        if (id) {
                          setFiles((prev) =>
                            prev.filter((val) => val.name !== id)
                          );
                        }
                      },
                    },
                  ]}
                  rowId={props.name}
                  content={[
                    props.name,
                    new Date(props.lastModified).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }),
                  ]}
                />
              ))}
            </Table>
          </FileDropBox>
        );
      }

      it("should not open file picker", () => {
        cy.mount(<FileDropBoxContent />);
        cy.findByLabelText("filedropbox").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );
        cy.wait(1000);

        cy.findByLabelText("filedropbox").then(($input) => {
          cy.spy($input[0], "click").as("fileClick");
        });
        cy.findByText("sample-1.jpg").should("be.visible").click();
        cy.findByText("sample-2.jpg").should("be.visible").click();

        cy.get("@fileClick").should("not.have.been.called");
      });
    });
  });

  context("onComplete", () => {
    context("when hide progress", () => {
      const onFileDropped = async ({
        error,
        files,
        setProgressLabel,
        succeed,
      }: OnFileDroppedFunctionProps) => {
        const file = files[0];
        setProgressLabel(`Uploading ${file.name}`);

        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;

            if (progress >= 100) {
              clearInterval(interval);
              if (file === null) {
                error(file, `file ${file.name} is not uploaded`);
              } else {
                succeed(file);
              }
              setProgressLabel(`Uploaded ${files[0].name}`);
              resolve();
            }
          }, 300);
        });
      };

      const onComplete = async ({
        failedFiles,
        setProgressLabel,
        succeedFiles,
        hideProgressLabel,
      }: OnCompleteFunctionProps) => {
        console.log(succeedFiles, "This is succeedFiles");
        console.log(failedFiles, "This is failedFiles");
        await setProgressLabel(
          `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
        );
        await hideProgressLabel();
      };
      it("should hide component", () => {
        cy.mount(
          <FileDropBox onFileDropped={onFileDropped} onComplete={onComplete} />
        );
        cy.findByLabelText("filedropbox").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );
        cy.wait(600);
        cy.findByLabelText("file-drop-box-container").should(
          "have.css",
          "display",
          "none"
        );
      });

      context("when show up", () => {
        const onFileDropped = async ({
          error,
          files,
          setProgressLabel,
          succeed,
        }: OnFileDroppedFunctionProps) => {
          const file = files[0];
          setProgressLabel(`Uploading ${file.name}`);

          return new Promise<void>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
              progress += 20;

              if (progress >= 100) {
                clearInterval(interval);
                if (file === null) {
                  error(file, `file ${file.name} is not uploaded`);
                } else {
                  succeed(file);
                }
                setProgressLabel(`Uploaded ${files[0].name}`);
                resolve();
              }
            }, 300);
          });
        };

        const onComplete = async ({
          failedFiles,
          setProgressLabel,
          succeedFiles,
          hideProgressLabel,
          showUploaderForm,
        }: OnCompleteFunctionProps) => {
          console.log(succeedFiles, "This is succeedFiles");
          console.log(failedFiles, "This is failedFiles");
          await setProgressLabel(
            `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
          );
          await hideProgressLabel();

          return new Promise<void>(() => {
            setTimeout(() => {
              showUploaderForm();
            }, 300);
          });
        };
        it("should show upload again", () => {
          cy.mount(
            <FileDropBox
              onFileDropped={onFileDropped}
              onComplete={onComplete}
            />
          );
          cy.findByLabelText("filedropbox").selectFile(
            [
              "test/fixtures/test-images/sample-1.jpg",
              "test/fixtures/test-images/sample-2.jpg",
            ],
            {
              action: "drag-drop",
              force: true,
            }
          );
          cy.wait(600);
          cy.findByLabelText("file-drop-box-container").should(
            "have.css",
            "display",
            "none"
          );
          cy.wait(600);
          cy.findByLabelText("file-drop-box-container").should(
            "have.css",
            "display",
            "flex"
          );
        });
      });
    });
  });

  context("with style", () => {
    context("when given on condition success", () => {
      const onFileDropped = async ({
        error,
        files,
        setProgressLabel,
        succeed,
      }: OnFileDroppedFunctionProps) => {
        const file = files[0];
        setProgressLabel(`Uploading ${file.name}`);

        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;

            if (progress >= 100) {
              clearInterval(interval);
              if (file === null) {
                error(file, `file ${file.name} is not uploaded`);
              } else {
                succeed(file);
              }
              setProgressLabel(`Uploaded ${files[0].name}`);
              resolve();
            }
          }, 300);
        });
      };

      const onComplete = async ({
        failedFiles,
        setProgressLabel,
        succeedFiles,
      }: OnCompleteFunctionProps) => {
        console.log(succeedFiles, "This is succeedFiles");
        console.log(failedFiles, "This is failedFiles");
        await setProgressLabel(
          `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
        );
      };
      it("should render style", () => {
        cy.mount(
          <FileDropBox
            styles={{
              successStyle: css`
                padding: 30px;
                border: 1px solid red;
              `,
            }}
            onFileDropped={onFileDropped}
            onComplete={onComplete}
          />
        );
        cy.findByLabelText("filedropbox").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );
        cy.findByLabelText("filedropbox")
          .should("not.have.css", "padding", "30px")
          .and("not.have.css", "border", "1px solid rgb(255, 0, 0)");
        cy.wait(600);
        cy.findByLabelText("filedropbox")
          .should("have.css", "padding", "30px")
          .and("have.css", "border", "1px solid rgb(255, 0, 0)");
      });
    });

    context("when idle", () => {
      const onFileDropped = async ({
        error,
        files,
        setProgressLabel,
        succeed,
      }: OnFileDroppedFunctionProps) => {
        const file = files[0];
        setProgressLabel(`Uploading ${file.name}`);

        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;

            if (progress >= 100) {
              clearInterval(interval);
              if (file === null) {
                error(file, `file ${file.name} is not uploaded`);
              } else {
                succeed(file);
              }
              setProgressLabel(`Uploaded ${files[0].name}`);
              resolve();
            }
          }, 300);
        });
      };

      const onComplete = async ({
        failedFiles,
        setProgressLabel,
        succeedFiles,
      }: OnCompleteFunctionProps) => {
        console.log(failedFiles, "This is failedFiles");
        await setProgressLabel(
          `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
        );
      };
      it("should render style", () => {
        cy.mount(
          <FileDropBox
            styles={{
              dragOverStyle: css`
                padding: 30px;
                border: 1px solid red;
              `,
            }}
            onFileDropped={onFileDropped}
            onComplete={onComplete}
          />
        );

        cy.findByLabelText("filedropbox")
          .should("have.css", "padding", "30px")
          .and("have.css", "border", "1px solid rgb(255, 0, 0)");
      });
    });
  });
});

import { css } from "styled-components";
import {
  FileDropBox,
  OnCompleteFunctionProps,
  OnFileDroppedFunctionProps,
} from "./../../components/file-drop-box";

describe("FileDropBox", () => {
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
            successStyle={css`
              padding: 30px;
              border: 1px solid red;
            `}
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
            dragOverStyle={css`
              padding: 30px;
              border: 1px solid red;
            `}
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

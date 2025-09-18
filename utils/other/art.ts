import figlet from "figlet";

export async function logFiglet(text: string) {
  const ascii = await figlet.text(text, {
    font: "3-d", // Try "Slant", "Ghost", etc.
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.log(ascii);
}

import React from "react";

interface BoldTextProps {
  text: string;
}

const BoldText: React.FC<BoldTextProps> = ({ text }) => {
  function makeBold(text: string): string {
    const lines = text.split("\n");
    const boldLines = lines.map((line) => {
      if (
        line.startsWith("Title:") ||
        line.startsWith("Acceptance Criteria:") ||
        line.startsWith("Test Case ") ||
        line.startsWith("Scenario") ||
        line.startsWith("Feature") ||
        line.startsWith("Assumptions") ||
        line.startsWith("Dependencies") ||
        line.startsWith("Background") ||
        line.startsWith("Set") ||
        line.startsWith("Device Compatibility") ||
        line.startsWith("User Role") ||
        line.startsWith("Stage") ||
        line.startsWith("Sub-stage") ||
        line.startsWith("Applicable BU") ||
        line.startsWith("Proposed") ||
        line.startsWith("###") ||
        line.startsWith("- **") ||
        line.match(/^\d+\./)
      ) {
        return `**${line}**`;
      }

      return line;
    });
    return boldLines.join("\n");
  }

  return (
    <div>
      {makeBold(text)
        .split("\n")
        .map((line, index) => (
          <div key={index}>
            {line.startsWith("**") && line.endsWith("**") ? (
              <strong style={{ fontWeight: 600 }}>
                {line.slice(2, -2).replace(/\*/g, "")}
              </strong>
            ) : (
              <span style={{ color: "#333333a3" }}>
                {line.replace(/\*/g, "")}
              </span>
            )}
            <br />
          </div>
        ))}
    </div>
  );
};

export default BoldText;

/**
 * @jest-environment jsdom
 */

import { loadTable } from "../lib/firestoreHelpers.js";
import db from "../lib/firebaseConfig.js";

// Mock Firestore behavior
jest.mock("../lib/firebaseConfig.js");

describe("loadTable", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table id="test-table">
        <tbody><tr><td>Old row</td></tr></tbody>
      </table>
    `;
  });

  it("clears the table before populating new rows", async () => {
    const mockData1 = { ProductID: "P001", Name: "Widget A", Price: 19.99, Stock: 50 };
    const mockData2 = { ProductID: "P002", Name: "Widget B", Price: 29.99, Stock: 20 };

    const mockSnapshot = {
      forEach: (cb) => {
        cb({ data: () => mockData1 });
        cb({ data: () => mockData2 });
      }
    };

    db.collection.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockSnapshot)
    });

    const mapRow = jest.fn().mockImplementation(d => `
      <tr>
        <td>${d.ProductID}</td>
        <td>${d.Name}</td>
        <td>$${d.Price}</td>
        <td>${d.Stock}</td>
      </tr>
    `);

    await loadTable("Inventory", "#test-table", mapRow);

    const tbody = document.querySelector("#test-table tbody");
    expect(tbody.innerHTML).toContain("Widget A");
    expect(tbody.innerHTML).toContain("Widget B");
    expect(tbody.innerHTML).not.toContain("Old row");
    expect(mapRow).toHaveBeenCalledTimes(2);
  });

  it("does nothing if tbody does not exist", async () => {
    // Remove the table entirely
    document.body.innerHTML = ``;

    const mockSnapshot = {
      forEach: () => {}
    };

    db.collection.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockSnapshot)
    });

    const mapRow = jest.fn();

    await loadTable("Inventory", "#nonexistent", mapRow);

    // mapRow should not be called
    expect(mapRow).not.toHaveBeenCalled();
  });

  it("logs an error if Firestore throws an error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    db.collection.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error("Firestore failure"))
    });

    await loadTable("Inventory", "#test-table", () => "<tr></tr>");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to load Inventory:"),
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("handles a mapRow function that throws an error internally", async () => {
    const mockData = { ProductID: "P999", Name: "Bad Widget" };

    const mockSnapshot = {
      forEach: (cb) => cb({ data: () => mockData })
    };

    db.collection.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockSnapshot)
    });

    // Simulate mapRow crash
    const mapRow = jest.fn(() => {
      throw new Error("Row mapping failed");
    });

    await expect(loadTable("Inventory", "#test-table", mapRow)).resolves.toBeUndefined();
  });
});

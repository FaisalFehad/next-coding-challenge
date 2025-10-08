import "@testing-library/jest-dom";

let mockCookies = {};

jest.mock("js-cookie", () => ({
  get: jest.fn((key) => {
    const cookies = global.mockCookies || mockCookies;
    const value = cookies[key];
    return value || null;
  }),
  set: jest.fn((key, value) => {
    const cookies = global.mockCookies || mockCookies;
    cookies[key] = value;
    return value;
  }),
  remove: jest.fn((key) => {
    const cookies = global.mockCookies || mockCookies;
    delete cookies[key];
  }),
}));

global.mockCookies = mockCookies;

global.fetch = jest.fn();

jest.mock("./src/app/api/products", () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: { us: "Test Product 1", uk: "Item 1" },
      price: { usd: 10.0, gbp: 8.0 },
      stock: 50,
    },
    {
      id: 2,
      name: { us: "Test Product 2", uk: "Item 2" },
      price: { usd: 20.0, gbp: 16.0 },
      stock: 30,
    },
    {
      id: 3,
      name: { us: "Test Product 3", uk: "Item 3" },
      price: { usd: 15.0, gbp: 12.0 },
      stock: 25,
    },
  ]),
  getUKProductData: jest.fn().mockImplementation((product) => ({
    id: product.id.toString(),
    name: product.name.uk,
    description: `£${product.price.gbp} - ${product.stock} in stock`,
    price: product.price.gbp,
    stock: product.stock,
  })),
}));

beforeEach(() => {
  mockCookies = {};
  global.mockCookies = mockCookies;
});

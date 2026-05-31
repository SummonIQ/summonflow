export default {
  name: "summonflow",
  description: "AppLab managed project",
  type: "monorepo",
  apps: [
    {
      description: "",
      dev: {
        command: "bun dev",
        port: 30220
      },
      name: "summonflow",
      path: ".",
      type: "web-app"
    },
    {
      description: "",
      name: "client-sdk",
      path: "packages/client-sdk",
      type: "library"
    },
    {
      description: "",
      name: "server-sdk",
      path: "packages/server-sdk",
      type: "library"
    }
  ]
};

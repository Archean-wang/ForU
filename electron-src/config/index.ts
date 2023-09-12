import Conf from "conf";

const schema = {
  exitToTray: {
    type: "boolean",
    default: true,
  },
  cleintId: {
    type: "string",
    default: "",
  },
  version: {
    type: "string",
    default: "0.0.0",
  },
  proxy: {
    type: "string",
    default: "",
  },
  language: {
    type: "string",
    default: "en",
  },
};

export default new Conf({ projectName: "foru", schema });

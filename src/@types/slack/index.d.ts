declare module "slackTypes" {
  export namespace slackTypes {
    interface Field {
      title: string;
      value: any;
      short?: boolean;
    }

    interface Block {
      type: string;
      text: any;
    }
  }
}

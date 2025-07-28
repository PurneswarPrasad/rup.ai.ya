declare module 'react-joyride' {
  import { Component } from 'react';

  export interface Props {
    steps: Step[];
    run: boolean;
    continuous?: boolean;
    showProgress?: boolean;
    showSkipButton?: boolean;
    styles?: {
      options?: {
        primaryColor?: string;
        zIndex?: number;
      };
    };
    callback?: (data: CallBackProps) => void;
  }

  export interface Step {
    target: string;
    content: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    disableBeacon?: boolean;
  }

  export interface CallBackProps {
    status: Status;
    type: string;
  }

  export enum Status {
    FINISHED = 'finished',
    SKIPPED = 'skipped',
  }

  export default class Joyride extends Component<Props> {}
}

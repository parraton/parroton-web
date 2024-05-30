import 'react-dom';

declare module 'react-dom' {
  function experimental_useFormState<State>(
    action: (state: State) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: () => void];
  function experimental_useFormState<State, Payload>(
    action: (state: State, payload: Payload) => Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: (payload: Payload) => void];

  interface FormStatusNotPending {
    pending: false;
    data: null;
    method: null;
    action: null;
  }

  interface FormStatusPending {
    pending: true;
    data: FormData;
    method: string;
    action: string | ((formData: FormData) => void | Promise<void>);
  }

  type FormStatus = FormStatusPending | FormStatusNotPending;

  function experimental_useFormStatus(): FormStatus;
}

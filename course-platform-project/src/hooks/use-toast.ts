import { toast, ExternalToast } from "sonner";

function actionToast({
  actionData,
  ...props
}: ExternalToast & {
  actionData: { error: boolean; message: string };
}) {
  const toastFn = actionData.error ? toast.error : toast.success;

  toastFn(actionData.error ? "Error" : "Success", {
    ...props,
    description: actionData.message,
  });
}
export { actionToast };

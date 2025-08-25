interface ErrorMessageProps {
  error: any;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <span className="text-danger">
    {(
      error?.error || // Direct error message (e.g., {error: "message"})
      error?.stack?.error ||
      error?.response?.data?.error ||
      error?.message ||
      'Unknown error'
    ).toString()}
  </span>
);

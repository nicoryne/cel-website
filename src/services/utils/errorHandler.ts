
export const handleError = (error: any, context: string) => {
    console.error(`🔴 Error: ${error.message} | Context: ${context}`);
    console.error(`Stack Trace: ${error.stack}`);
  };
  
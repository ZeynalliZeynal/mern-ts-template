import { useSearchParams } from "react-router-dom";

export const useAdvancedParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    params: (field: string) => searchParams.get(field)?.split(","),
    handleMultipleParam: (field: string, value: string) => {
      const params = searchParams.get(field)?.split(",");
      const selectedValues = new Set(params);
      if (selectedValues.has(value)) selectedValues.delete(value);
      else selectedValues.add(value);

      setSearchParams((prev) => {
        if (selectedValues.size === 0) prev.delete(field);
        else prev.set(field, [...selectedValues].join(","));
        return prev;
      });
    },
    handleSingleParam: (field: string, value: string) => {
      setSearchParams(
        (prev) => {
          if (
            value === null ||
            value === "" ||
            value === searchParams.get(field)
          )
            prev.delete(field);
          else prev.set(field, value);
          return prev;
        },
        { replace: true },
      );
    },
  };
};

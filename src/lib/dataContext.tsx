import { createContext, useContext, useState, ReactNode } from 'react';

interface PreloadedData {
  [key: string]: any;
}

interface DataContextType {
  data: PreloadedData;
  setData: (key: string, value: any) => void;
  getData: (key: string) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const usePreloadedData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('usePreloadedData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<PreloadedData>({});

  const setData = (key: string, value: any) => {
    setDataState((prev) => ({ ...prev, [key]: value }));
  };

  const getData = (key: string) => data[key];

  return (
    <DataContext.Provider value={{ data, setData, getData }}>
      {children}
    </DataContext.Provider>
  );
};
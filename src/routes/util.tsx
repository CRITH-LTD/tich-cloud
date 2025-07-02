import { ReactNode, Suspense } from "react";
import { Loading } from "../components/Loading/loading";

type LazyComponentProp = {
    childNode: ReactNode;
    animated?: boolean;
};

export const LazyComponentWrapper = ({ childNode: element, animated }: LazyComponentProp) => {
   

    return (
      <Suspense fallback={<Loading />}>
        {
          animated ? (
            <div className="page-box animate-fade-in">
              { element }
            </div>
          ) : 
          element
        }
      </Suspense>
    );
};

import { useGetWorksQuery } from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import WorkCard from "../../components/WorkCard/WorkCard";
import { useEffect } from "react";

const WorkerWorksScreen = () => {
  const { data: works, isFetching, isLoading, error } = useGetWorksQuery();

  return isLoading || isFetching ? (
    <Loader />
  ) : (
    <div>
      {works &&
        works.map((work, key) => {
          return <WorkCard workDetails={work.work} key={key} />;
        })}
    </div>
  );
};

export default WorkerWorksScreen;

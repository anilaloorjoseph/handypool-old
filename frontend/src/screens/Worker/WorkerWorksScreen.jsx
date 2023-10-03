import { useGetWorksQuery } from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import WorkCard from "../../components/WorkCard/WorkCard";
import { useEffect } from "react";

const WorkerWorksScreen = () => {
  const { data: works, isFetching, isLoading, error } = useGetWorksQuery();

  useEffect(() => {
    console.log(works);
  }, [works]);

  return isLoading || isFetching ? (
    <Loader />
  ) : (
    <div>
      <WorkCard />
    </div>
  );
};

export default WorkerWorksScreen;

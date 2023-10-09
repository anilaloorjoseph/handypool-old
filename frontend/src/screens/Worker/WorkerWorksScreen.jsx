import { useGetWorksQuery } from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import WorkCard from "../../components/WorkCard/WorkCard";
import WorkerPagination from "../../components/Pagination/WorkerWorkPagination/WorkerWorkPagination";

const WorkerWorksScreen = () => {
  const { data: works, isFetching, isLoading, error } = useGetWorksQuery();

  return isLoading || isFetching ? (
    <Loader />
  ) : (
    <div className="position-relative">
      {works &&
        works.map((work, key) => {
          return <WorkCard workDetails={work.work} key={key} />;
        })}
      <WorkerPagination />
    </div>
  );
};

export default WorkerWorksScreen;

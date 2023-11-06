import {
  useGetWorksQuery,
  useMakeworksReadMutation,
} from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import WorkCard from "../../components/WorkCard/WorkCard";
import Pagination from "../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../../components/SeachBar/SearchBar";

const WorkerWorksScreen = () => {
  const [works, setWorks] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const searchQuery = (value) => {
    setQuery(value);
  };

  const setPageNumber = (page) => {
    setPage(page);
  };

  const {
    data,
    isLoading: loadingWorks,
    error,
  } = useGetWorksQuery({
    page,
    query,
  });

  const [makeWorksRead, { isLoading }] = useMakeworksReadMutation();

  useEffect(() => {
    if (data !== null && data !== undefined) {
      setWorks(data.works);
      setPage(data.page);
      setPages(data.pages);

      return () => {
        (async () => {
          const ids = data.works.map((value, key) => {
            return value._id;
          });
          try {
            const res = await makeWorksRead({ ids }).unwrap();
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        })();
      };
    }
    if (error) toast.error(error);
  }, [data]);

  return isLoading || loadingWorks ? (
    <Loader />
  ) : (
    <div className="position-relative">
      <div className="w-100 my-4">
        <SearchBar placeholder={"Search works.."} method={searchQuery} />
      </div>
      {works &&
        works.map((work, key) => {
          return (
            <WorkCard
              workDetails={work.work[0]}
              key={key}
              isRead={work.isRead}
            />
          );
        })}

      <Pagination pages={pages} page={page} method={setPageNumber} />
    </div>
  );
};

export default WorkerWorksScreen;

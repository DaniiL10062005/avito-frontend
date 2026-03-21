import { Header } from "./components/Header";
import { MainSection } from "./components/main-section/MainSection";
import { Searchbar } from "./components/search-bar/SearchBar";

export const Ads = () => {
  return (
    <div className="flex flex-col gap-4 mx-8 my-3">
      <Header />
      <Searchbar />
      <MainSection />
    </div>
  );
};

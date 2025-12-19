import { useState } from "react";
import { X } from "lucide-react";

function MovieFiltters({
    close,genre,language,region,year,
    sName, setSName,
    setGenre, setLanguage,
    setRegion,
    setYear,
    onHandleSearch,
    onHandleMoreSearchFillters,
    onHandleClear
}) {

    function handleSearch() {
        onHandleSearch()
        close?.();
    }

    function handleApplyFillters() {
        onHandleMoreSearchFillters()
        close?.()
    }

    function handleClearFillters() {
        setGenre(null);
        setLanguage(null);
        setRegion(null);
        setSName('');
        setYear(null);
        onHandleClear();
        close?.();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
                onClick={close}
            />

            {/* FILTER BOX */}
            <div className="relative w-full max-w-3xl bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl p-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-white">Filter Movies</h2>
                    <button onClick={close}>
                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                </div>



                {/* FILTER CONTENT */}
                <div className="flex flex-col gap-5 items-center">


                    {/* SEARCH */}
                    <div className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-3xl lg:w-135">
                        <input
                            placeholder="Enter movie name"
                            className="bg-transparent outline-none flex-1 text-white"
                            type="text"
                            value={sName}
                            onChange={(e) => setSName(e.target.value)}
                        />
                        <button
                            className="text-sm text-blue-500 hover:text-blue-400"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    {/* FILTER ROW */}
                    <div className="flex gap-3 flex-wrap justify-center">

                        {/* GENRE */}
                        <select
                            value={genre??""}
                            className="bg-gray-900 px-5 py-2 rounded-3xl text-white outline-none cursor-pointer"
                            onChange={(e) => setGenre(e.target.value || null)}
                        >
                            <option value="">Genre</option>
                            <option value="28">Action</option>
                            <option value="35">Comedy</option>
                            <option value="18">Drama</option>
                            <option value="10749">Romance</option>
                            <option value="27">Horror</option>
                            <option value="53">Thriller</option>
                        </select>

                        {/* LANGUAGE */}
                        <select
                            value={language??""}
                            className="bg-gray-900 px-5 py-2 rounded-3xl text-white outline-none cursor-pointer"
                            onChange={(e) => setLanguage(e.target.value || null)}
                        >
                            <option value="">Language</option>
                            <option value="hi">Hindi</option>
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                            <option value="te">Telugu</option>
                            <option value="ml">Malayalam</option>
                            <option value="kn">Kannada</option>
                        </select>

                        {/* INDUSTRY */}
                        <select
                            value={region??""}
                            className="bg-gray-900 px-5 py-2 rounded-3xl text-white outline-none cursor-pointer"
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "bollywood") {
                                    setLanguage("hi");
                                    setRegion("IN");
                                } else if (val === "hollywood") {
                                    setLanguage("en");
                                    setRegion(null);
                                } else {
                                    setLanguage(null);
                                    setRegion(null);
                                }
                            }}
                        >
                            <option value="">Industry</option>
                            <option value="bollywood">Bollywood</option>
                            <option value="hollywood">Hollywood</option>
                        </select>

                        {/* YEAR */}
                        <select
                            value={year??""}
                            className="bg-gray-900 px-5 py-2 rounded-3xl text-white outline-none cursor-pointer"
                            onChange={(e) => setYear(e.target.value || null)}
                        >
                            <option value="">Year</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>

                    {/* APPLY BUTTON */}
                    <button
                        onClick={handleApplyFillters}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 py-3 cursor-pointer rounded-xl lg:w-130 font-medium"
                    >
                        Apply Filters
                    </button>

                    {/* Clear Fillters */}
                    <button className="flex cursor-pointer px-4 gap-2 rounded py-2 bg-gray-700" onClick={handleClearFillters}>Clear Fillters<X className="text-black" /> </button>

                </div>
            </div>
        </div>
    );
}

export default MovieFiltters;

import React, {useEffect} from "react"
import SearchBar from "./SearchBar";
import axios from "axios";
import Profile from "./Profile";
import NavBar from "../navBar/NavBar";

export default function SearchPage() {
    document.title = "Search"

    const [searchData, setSearchData] = React.useState(null);
    const [userNotFound, setUserNotFound] = React.useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/search-all-analysts-include-sub-info`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log('All analysts: ' , response.data);
                setSearchData(response.data);

                response.data.map(data => {
                    console.log(data.subscribed)
                })


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const onSearch = (searchTerm) => {
        console.log('Performing search with searchTerm:', searchTerm);

        axios.get(process.env.REACT_APP_BACKEND_URL+`/search-analyst-include-sub-info?search=${searchTerm}`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

            )
            .then(response => {

                //console.log('API response:', response.data[0].username);
                setSearchData(response.data)
                setUserNotFound(false);
            })
            .catch(error => {

                if(error.response && error.response.status === 404) {
                    console.log("User not found")
                    setUserNotFound(true);
                } else {
                    console.error('Error:', error.message);
                }
            });
    };

    function renderComponents() {
        if(searchData === null) {
            return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
            )
        } else if(userNotFound) {
            return (
                <div className="user-not-found">User not found</div>
            )
        } else {
            return (
                <div
                    className="search--profile--container"
                >
                    {searchData.map((data, index) => (
                        <div className="search--profile--tab" key={index}>
                            <Profile
                                key={index}
                                name={data.profile.username}
                                id={data.profile.id}
                                isSubscribed={data.subscribed}
                            >
                            </Profile>
                        </div>

                    ))}
                </div>
            )
        }
    }


    return(
        <div className="search--body">
            <NavBar/>
            <div className="search--header">
                <h1>Discover analysts</h1>
            </div>
            <SearchBar onSearch={onSearch} classname="search--search"/>

            {renderComponents()}
        </div>

    )
}

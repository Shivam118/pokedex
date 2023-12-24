/* eslint-disable react-hooks/exhaustive-deps */
import React, { useDebugValue, useEffect, useState } from "react";
import {
  Input,
  Layout,
  theme,
  Dropdown,
  Space,
  Typography,
  Alert,
  Spin,
  Flex,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import PokeCards from "../components/PokeCards";
import PokeModals from "../components/PokeModals";
import { ModalContext } from "../context/ModalContext";
import styles from "../assets/css/Home.module.css";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPokemon, setAllPokemon] = useState([]);
  const [modalScreen, setModalScreen] = useState(false);
  const [chosenPokemon, setChosenPokemon] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [pokeType, setPokeType] = useState("all");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch = (value, _e, info) => setSearch(value);

  const getPokemons = async () => {
    setLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${40 * page}`
    );
    const data = await res.json();
    setAllPokemon(data.results);
    setLoading(false);
  };

  const searchSinglePokemon = async () => {
    setLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
    const data = await res.json();
    setAllPokemon([data]);
    setLoading(false);
  };

  const dropdownItems = [
    { key: "all", label: "All" },
    { key: "normal", label: "Normal" },
    { key: "fighting", label: "Fighting" },
    { key: "flying", label: "Flying" },
    { key: "poison", label: "Poison" },
    { key: "ground", label: "Ground" },
    { key: "rock", label: "Rock" },
    { key: "bug", label: "Bug" },
    { key: "ghost", label: "Ghost" },
    { key: "steel", label: "Steel" },
    { key: "fire", label: "Fire" },
    { key: "water", label: "Water" },
    { key: "grass", label: "Grass" },
    { key: "electric", label: "Electric" },
    { key: "psychic", label: "Psychic" },
    { key: "ice", label: "Ice" },
    { key: "dragon", label: "Dragon" },
    { key: "dark", label: "Dark" },
    { key: "fairy", label: "Fairy" },
    { key: "unknown", label: "Unknown" },
    { key: "shadow", label: "Shadow" },
  ];

  const handleInfinteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 5 >=
      document.documentElement.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePokeTypes = async (e) => {
    const { key } = e;
    if (key === "all") {
      getPokemons();
    } else {
      setPokeType(key);
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/type/${e.key}`);
      const data = await res.json();
      setAllPokemon(data.pokemon.map((poke) => poke.pokemon));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pokeType === "all") {
      getPokemons();
    }
    window.addEventListener("scroll", handleInfinteScroll);
    return () => window.removeEventListener("scroll", handleInfinteScroll);
  }, [page, pokeType]);

  useEffect(() => {
    if (chosenPokemon) {
      setModalScreen(true);
    }
  }, [chosenPokemon]);

  return (
    <ModalContext.Provider
      value={{ modalScreen, setModalScreen, chosenPokemon, setChosenPokemon }}
    >
      <Layout>
        {modalScreen && <PokeModals />}
        <Header className={styles.Header}>
          <Flex
            justify={"space-between"}
            align={"center"}
            wrap={"wrap"}
            gap="middle"
            style={{
              height: "auto",
              width: "100%",
              padding: "20px 0px",
            }}
          >
            <div className="demo-logo">
              <img
                src={"https://i.imgur.com/AYutZOF.png"}
                alt={"banner"}
                style={{ width: "200px" }}
              />
            </div>
            <Search
              placeholder="Enter Pokemon Name or ID"
              onSearch={onSearch}
              style={{
                width: 300,
                background: "#efefef",
                borderRadius: "10px",
              }}
            />
            <Dropdown
              menu={{
                items: dropdownItems,
                selectable: true,
                defaultSelectedKeys: ["1"],
                onClick: handlePokeTypes,
              }}
            >
              <Typography.Link
                style={{ color: "white" }}
                onClick={(e) => e.preventDefault()}
              >
                <Space>
                  Type
                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </Flex>
        </Header>
        <Content className={styles.Content}>
          <div
            className={styles.cardSection}
            style={{
              background: colorBgContainer,
              borderradius: borderRadiusLG,
            }}
          >
            {allPokemon?.map((pokemon) => (
              <PokeCards key={pokemon.name} url={pokemon.url} />
            ))}
          </div>
          {loading && <Spin tip="Loading..." />}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Pokedex ©2023 Created by Shivam Sharma
        </Footer>
      </Layout>
    </ModalContext.Provider>
  );
};

export default Home;

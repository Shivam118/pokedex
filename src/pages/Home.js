/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Input,
  Layout,
  theme,
  Dropdown,
  Space,
  Typography,
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
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch = (value, _e, info) => {
    value === "" ? setText("") : setText(`search/${value}`);
  };

  const getPokemons = async () => {
    setLoading(true);
    const q = text?.split("/");
    let res;
    let data;
    if (q[0] === "search") {
      res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${q[1].toLowerCase()}`
      );
      if (res.status === 404) setError(true);
      else {
        setError(false);
        data = await res.json();
        setAllPokemon([{ name: data.forms[0].name, url: data.forms[0].url }]);
      }
    } else if (q[0] === "type") {
      res = await fetch(`https://pokeapi.co/api/v2/type/${q[1]}`);
      if (res.status === 404) setError(true);
      else {
        setError(false);
        data = await res.json();
        setAllPokemon(data.pokemon.map((poke) => poke.pokemon));
      }
    } else {
      res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${40 * page}`);
      if (res.status === 404) setError(true);
      else {
        setError(false);
        data = await res.json();
        setAllPokemon(data.results);
      }
    }
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
      text === "" &&
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePokeTypes = async (e) => {
    if (e.key === "all") setText("");
    else setText(`type/${e.key}`);
  };

  useEffect(() => {
    getPokemons();
    window.addEventListener("scroll", handleInfinteScroll);
    return () => window.removeEventListener("scroll", handleInfinteScroll);
  }, [page]);

  useEffect(() => {
    getPokemons();
  }, [text]);

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
          {error ? (
            <h1
              style={{
                fontSize: "30px",
                textAlign: "center",
                padding: "20px",
                fontWeight: "700",
              }}
            >
              Not Found
            </h1>
          ) : (
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
          )}
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

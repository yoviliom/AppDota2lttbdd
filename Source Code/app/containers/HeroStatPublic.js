import React, { Component } from "react";
import ScreenTypes from "../navigators/ScreenTypes";
import { NavigationBarWithMatchSearch } from "../components/NavigationBar";
import { View, DropDownMenu } from "@shoutem/ui";
import Pagination from "../components/Pagination";
import PublicMatchRow, {
  HERO_STAT_ROW_HEIGHT
} from "../components/HeroStatRowPublicMatch";
import { FlatList, ScrollView, Dimensions } from "react-native";
import Loading from "../components/Loading";
import { Pages } from "react-native-pages";

import { createGroupedArray, round } from "../utils/utilsFunction";

import themeColors from "../themes/colors";
import * as heroStatActions from "../actions/HeroStatAction";
import { connectStyle } from "@shoutem/theme";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getHeroImage } from "../utils/getHeroImage";
import kFormatter from "../utils/kFormatter";

class HeroStatPublic extends Component {
  constructor(props) {
    super(props);

    let flatListHeight = Dimensions.get("window").height;

    this.state = {
      flatListHeight,
      heroStats: [],
      selectedRank: '',
      currentPageIndex: 0,
      refreshing: false,
      sortedColumn: "id",
      ascending: true,
      ranks: [
        {name: 'Herald', value: 1},        
        {name: 'Guardian', value: 2},
        {name: 'Crusader', value: 3},
        {name: 'Archon', value: 4},
        {name: 'Legend', value: 5},
        {name: 'Ancient', value: 6},
        {name: 'Divine', value: 7},
      ]
    };

    //this.renderItem = this.renderItem.bind(this);
    //this.onRefresh = this.onRefresh.bind(this);
    
    //this.renderFooter = this.renderFooter.bind(this);
    //this.keyExtractor = this.keyExtractor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.heroStats != nextProps.heroStats) {
      const matchCounts = this.calculateTotalPublicMatches(nextProps.heroStats);
      const heroStats = this.processHeroStatsPublicMatch(
        nextProps.heroStats,
        matchCounts
      );
      const currentRankStatsDisplay = heroStats[0];
      this.setState({ heroStats, currentRankStatsDisplay });
    }
  }

  componentDidMount() {
    
  }

  calculateTotalPublicMatches(heroStats) {
    let totalPulicMatchesForEachRank = [];
    let sum = (a, b) => a + b;

    const matchCount7 =
      heroStats.map(heroStat => heroStat["7_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount6 =
      heroStats.map(heroStat => heroStat["6_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount5 =
      heroStats.map(heroStat => heroStat["5_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount4 =
      heroStats.map(heroStat => heroStat["4_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount3 =
      heroStats.map(heroStat => heroStat["3_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount2 =
      heroStats.map(heroStat => heroStat["2_pick"] || 0).reduce(sum, 0) / 10;
    const matchCount1 =
      heroStats.map(heroStat => heroStat["1_pick"] || 0).reduce(sum, 0) / 10;

    const matchCountPublic =
      matchCount7 +
      matchCount6 +
      matchCount5 +
      matchCount4 +
      matchCount3 +
      matchCount2 +
      matchCount1;

    totalPulicMatchesForEachRank.push(
      matchCountPublic,
      matchCount1,
      matchCount2,
      matchCount3,
      matchCount4,
      matchCount5,
      matchCount6,
      matchCount7
    );

    return totalPulicMatchesForEachRank;
  }

  processHeroStatsPublicMatch(heroStats, matchCounts) {
    let processedData = [];
    let heraldStats = [],
      guardianStats = [],
      crusaderStats = [],
      archonStats = [],
      legendStats = [],
      ancientStats = [],
      divineStats = [];

    for (let i = 0; i < heroStats.length; i++) {
      const heroStat = heroStats[i];
      const heroName = heroStat["localized_name"];
      const heroImg = getHeroImage(heroStat["id"]);

      let heraldStat = {},
        guardianStat = {},
        crusaderStat = {},
        archonStat = {},
        legendStat = {},
        ancientStat = {},
        divineStat = {};

      heraldStat.heroName = heroName;
      guardianStat.heroName = heroName;
      crusaderStat.heroName = heroName;
      archonStat.heroName = heroName;
      legendStat.heroName = heroName;
      ancientStat.heroName = heroName;
      divineStat.heroName = heroName;

      heraldStat.heroImg = heroImg;
      guardianStat.heroImg = heroImg;
      crusaderStat.heroImg = heroImg;
      archonStat.heroImg = heroImg;
      legendStat.heroImg = heroImg;
      ancientStat.heroImg = heroImg;
      divineStat.heroImg = heroImg;

      heraldStat.id = heroStat["id"];
      guardianStat.id = heroStat["id"];
      crusaderStat.id = heroStat["id"];
      archonStat.id = heroStat["id"];
      legendStat.id = heroStat["id"];
      ancientStat.id = heroStat["id"];
      divineStat.id = heroStat["id"];

      const heraldPick = heroStat["1_pick"] || 0;
      const heraldWin = heroStat["1_win"] || 0;
      heraldStat.winMatches = heraldWin;
      heraldStat.winRate = heraldPick ? round(heraldWin / heraldPick * 100) : 0;
      heraldStat.pickRate = round(heraldPick / matchCounts[1] * 100);
      heraldStat.pickMatches = heraldPick;
      heraldStats[i] = heraldStat;

      const guardianPick = heroStat["2_pick"] || 0;
      const guardianWin = heroStat["2_win"] || 0;
      guardianStat.winMatches = guardianWin;
      guardianStat.winRate = guardianPick
        ? round(guardianWin / guardianPick * 100)
        : 0;
      guardianStat.pickRate = round(guardianPick / matchCounts[2] * 100);
      guardianStat.pickMatches = heraldPick;
      guardianStats[i] = guardianStat;

      const crusaderPick = heroStat["3_pick"] || 0;
      const crusaderWin = heroStat["3_win"] || 0;
      crusaderStat.winMatches = crusaderWin;
      crusaderStat.winRate = crusaderPick
        ? round(crusaderWin / crusaderPick * 100)
        : 0;
      crusaderStat.pickRate = round(crusaderPick / matchCounts[3] * 100);
      crusaderStat.pickMatches = crusaderPick;
      crusaderStats[i] = crusaderStat;

      const archonPick = heroStat["4_pick"] || 0;
      const archonWin = heroStat["4_win"] || 0;
      archonStat.winMatches = archonWin;
      archonStat.winRate = archonPick ? round(archonWin / archonPick * 100) : 0;
      archonStat.pickRate = round(archonPick / matchCounts[4] * 100);
      archonStat.pickMatches = archonPick;
      archonStats[i] = archonStat;

      const legendPick = heroStat["5_pick"] || 0;
      const legendWin = heroStat["5_win"] || 0;
      legendStat.winMatches = legendWin;
      legendStat.winRate = legendPick ? round(legendWin / legendPick * 100) : 0;
      legendStat.pickRate = round(legendPick / matchCounts[5] * 100);
      legendStat.pickMatches = legendPick;
      legendStats[i] = legendStat;

      const ancientdPick = heroStat["6_pick"] || 0;
      const ancientWin = heroStat["6_win"] || 0;
      ancientStat.winMatches = ancientWin;
      ancientStat.winRate = ancientdPick
        ? round(ancientWin / ancientdPick * 100)
        : 0;
      ancientStat.pickRate = round(ancientdPick / matchCounts[6] * 100);
      ancientStat.pickMatches = ancientdPick;
      ancientStats[i] = ancientStat;

      const divinePick = heroStat["7_pick"] || 0;
      const divineWin = heroStat["7_win"] || 0;
      divineStat.winMatches = divineWin;
      divineStat.winRate = divinePick ? round(divineWin / divinePick * 100) : 0;
      divineStat.pickRate = round(divinePick / matchCounts[1] * 100);
      divineStat.pickMatches = divinePick;
      divineStats[i] = divineStat;
    }

    processedData.push(
      heraldStats,
      guardianStats,
      crusaderStats,
      archonStats,
      legendStats,
      ancientStats,
      divineStats
    );

    return processedData;
  }

  renderItem({ item, index }) {
    return <PublicMatchRow match={item} index={index} />;
  }

  getItemLayout(data, index) {
    return {
      offset: HERO_STAT_ROW_HEIGHT * index,
      length: HERO_STAT_ROW_HEIGHT,
      index
    };
  }

  onRefresh() {}

  renderFooter() {
    const { currentPageIndex} = this.state;    

    return (
      <Pagination
        totalPages={totalPages}
        currentIndex={currentPageIndex}
        numberPagesShow={5}
        onNext={this.nextPage}
        onPrev={this.prevPage}
        onPage={this.goToPage}
      />
    );
  }

  keyExtractor(item, index) {
    return item.matchId;
  }

  onOptionSelected(item){

  }

  render() {
    const styles = this.props.style;
    const { navigation } = this.props;
    const { isLoadingHeroStats, heroStats } = this.props;
    const { currentPageIndex, ranks, selectedRank } = this.state;

    let content = <View />;

    if (isLoadingHeroStats) {
      content = <Loading />;
    } else if (heroStats.length > 0) {
      content = (
        <DropDownMenu
        styleName="horizontal"
        options={ranks}
        selectedOption={selectedRank ? selectedCar : ranks[0]}
        onOptionSelected={this.onOptionSelected}
        titleProperty="name"
        valueProperty="value"
      />
      );
    }

    return <ScrollView styleName="fill-parent dota2">{content}</ScrollView>;
  }
}

HeroStatPublic.navigationOptions = {
  title: "Heroes in Professional Matches",
  tabBarLabel: "Professional"
};

const styles = {
  container: {
    marginLeft: 15,
    marginRight: 15
  }
};

function mapStateToProps(state) {
  return {
    isLoadingHeroStats: state.heroStatsState.isLoadingHeroStats,
    isEmptyHeroStats: state.heroStatsState.isEmptyHeroStats,
    heroStats: state.heroStatsState.heroStats
  };
}

function mapDispatchToprops(dispatch) {
  return {
    actions: bindActionCreators(heroStatActions, dispatch)
  };
}

export default connectStyle("dota2app.HeroStatPublic", styles)(
  connect(mapStateToProps, mapDispatchToprops)(HeroStatPublic)
);

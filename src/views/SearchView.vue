<template>
  <div id="search-view-loading" v-if="isLoading || !isInitialized">
    <span>판결문을 찾고 있습니다</span>
    <loading-bounce />
  </div>
  <div v-else id="search-view">
    <div class="description-container">
      <!-- 대상 판결문 속성 -->
      <template v-if="keywords.length > 0">
        <p>
          <span class="highlight-big">{{ kindC }}</span
          >의 <span class="highlight-big">{{ kindB }}</span> 사건 중
        </p>
        <p>
          <span class="highlight">{{ keywords.join(", ") }}</span> 키워드와
          관련된 판결문을
        </p>
      </template>
      <template v-else>
        <p>
          <span class="highlight-big">{{ kindC }}</span
          >의 <span class="highlight-big">{{ kindB }}</span> 사건에 해당하는
          판결문을
        </p>
      </template>
      <!-- 찾은 개수 -->
      <p>
        <span class="highlight-big"
          >{{ numStats.withKeywords["total"] }}건</span
        >
        찾았습니다
      </p>
    </div>

    <div
      class="report-button-container"
      style="
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 2rem;
      "
    >
      <p style="margin-bottom: 1rem">
        여러 데이터를 기반으로 내 상황을 요약해볼까요?
      </p>
      <button-card
        text="📋 내 상황 분석하기"
        theme="unselected"
        @click="$router.push({ name: 'Report' })"
        style="font-size: 1.2rem; width: 256px"
      />
    </div>

    <!-- 검색결과 내 옵션 -->
    <div class="form-container">
      <card-radio
        title=""
        description="어떤 결과의 판결문을 보여드릴까요?"
        :options="apiOptions.kindA"
        :labels="getKindARadioLabels()"
        v-model="kindA"
        @changed="onChangeKindA"
        :allowUnselect="false"
      />
      <card-radio
        title=""
        description="어떤 심급의 판결문을 보여드릴까요?"
        :options="apiOptions.courtLevel"
        :labels="apiOptions.courtLevelLabel"
        v-model="courtLevel"
        @changed="onChangeCourtLevel"
        :allowUnselect="false"
      />
    </div>

    <!-- 옵션 적용된 검색결과의 목록 -->
    <template v-if="items.length > 0">
      <div class="item-container">
        <item-card
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @go-detail="goDetail(item)"
        />
      </div>

      <!-- 더 불러오기 -->
      <div class="fetch-more-button">
        <button-card
          text="더 불러오기"
          theme="selected"
          @click="onRequestMoreItmes"
        />
      </div>
    </template>
    <template v-else>
      <div class="item-container">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem">
          검색 조건에 부합하는 판결문이 없습니다.
        </p>
        <p style="font-size: 1.2rem; margin-bottom: 1rem">
          다른 조건을 선택해주세요.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardRadio from "@/components/CardRadio.vue";
import LoadingBounce from "@/components/LoadingBounce.vue";
import ItemCard from "@/components/ItemCard.vue";
import ButtonCard from "@/components/ButtonCard.vue";
import { apiOptions } from "@/globalConst.js";
import fetchPage from "@/utils/fetchPage.js";
import getNumStats from "@/utils/getNumStats.js";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

// request params
const keywords = route.query.keywords
  .split(",")
  .filter((keyword) => keyword != "");
const kindA = route.query.kindA ? ref(route.query.kindA) : ref("취소");
const kindB = route.query.kindB;
const kindC = route.query.kindC;
const numOfRows = ref(5);
const pageNum = ref(1);
const PAGE_NUM_MIN = 1;

// response data
const numStats = ref({});
const items = ref([]);

// etc state
const isInitialized = ref(false);
const clientNumOfRows = 5;
const pageFetchNumAtOnce = 1;
const courtLevel = route.query.courtLevel
  ? ref(route.query.courtLevel)
  : ref(0);

// init
init();

// event handlers
async function onChangeKindA() {
  pageNum.value = PAGE_NUM_MIN;
  items.value = [];
  const _pageFetchNumAtOnce = keywords.length === 0 ? 1 : pageFetchNumAtOnce;
  await fetchNItems(clientNumOfRows, _pageFetchNumAtOnce);
}

async function onChangeCourtLevel() {
  pageNum.value = PAGE_NUM_MIN;
  items.value = [];
  const _pageFetchNumAtOnce = keywords.length === 0 ? 1 : pageFetchNumAtOnce;
  await fetchNItems(clientNumOfRows, _pageFetchNumAtOnce);
}

async function onRequestMoreItmes() {
  const scrollLocation = document.documentElement.scrollTop;
  await fetchNItems(clientNumOfRows, pageFetchNumAtOnce);
  window.scrollTo(0, scrollLocation); // 스크롤 위치 복원
}
function goDetail(item) {
  router.push({
    name: "Detail",
    state: {
      item: toRaw(item),
    },
  });
}

// functions

function getKindARadioLabels() {
  return apiOptions.kindA.map((option, index) => {
    return (
      apiOptions.kindALabel[index] +
      ` (${numStats.value.withKeywords[option]}건)`
    );
  });
}

async function fetchNItems(itemNum, _pageFetchNumAtOnce) {
  // fetch n items that have keywords in their contents
  // -- itemNum: number of items to get
  // -- pageFetchNumAtOnce: number of pages to fetch at once (fetch speed)

  try {
    isLoading.value = true;

    let cntItem = 0; // how many items with keywords are fetched
    let itemsLengthBeforeLoop = items.value.length;

    while (
      cntItem < itemNum &&
      pageNum.value <
        numStats.value.withoutKeywords[kindA.value] / numOfRows.value + 1
    ) {
      const curPageNum = pageNum.value;
      pageNum.value += _pageFetchNumAtOnce;
      // console.log(curPageNum, pageNum.value, items.value.length, cntItem);

      // fetch
      const promises = [];
      for (let i = curPageNum; i < pageNum.value; i++) {
        promises.push(
          fetchPage({
            pageNo: i,
            numOfRows: numOfRows.value,
            kindA: kindA.value,
            kindB: kindB,
            kindC: kindC,
            keywords: keywords,
            courtLevel: courtLevel.value,
          }).then((fetched) => {
            items.value = [...items.value, ...fetched];
          })
        );
      }
      await Promise.all(promises);

      cntItem = items.value.length - itemsLengthBeforeLoop;
    }

    if (cntItem < itemNum) {
      alert("모든 판결문을 불러왔습니다.");
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function _getNumStats() {
  try {
    isLoading.value = true;
    numStats.value = await getNumStats({
      kindB: kindB,
      kindC: kindC,
      keywords: keywords,
    });
  } catch (error) {
    console.error(error);
    alert(error);
  } finally {
    isLoading.value = false;
  }
}

async function init() {
  // get numStats
  await _getNumStats();
  // console.log(numStats.value);
  isInitialized.value = true;

  // get initial items
  const _pageFetchNumAtOnce = keywords.length === 0 ? 1 : pageFetchNumAtOnce;
  await fetchNItems(clientNumOfRows, _pageFetchNumAtOnce);
  // console.log(items.value);
  // console.log(items.value.length);
}
</script>

<style lang="scss" scoped>
#search-view-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4rem;
  height: 100%;
  font-size: 1.3rem;
  background-color: $grey-light;
}
#search-view {
  background-color: $grey-light;

  .description-container {
    padding: 3rem 2rem;
    background-color: white;
    line-height: 2rem;
    .highlight {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .highlight-big {
      font-weight: bold;
      font-size: 1.5rem;
    }
  }

  .form-container {
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    // flex-wrap: wrap;
    // justify-content: space-evenly;
    gap: 1rem;
    padding: 2rem;
    .item-card {
      width: 50%;
    }
  }

  .fetch-more-button {
    padding: 2rem;
  }
}

@media (max-width: 1280px) {
  #search-view {
    .form-container {
      flex-direction: column;
    }

    .item-container {
      .item-card {
        width: 80%;
      }
    }
  }
}

@media (max-width: 768px) {
  #search-view {
    .item-container {
      .item-card {
        width: 100%;
      }
    }
  }
}
</style>

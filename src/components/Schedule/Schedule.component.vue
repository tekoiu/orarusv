<template>
  <div class="schedule mt-xl-5 mt-lg-5 mt-md-4 mt-sm-3 mt-3 container">
    <b-row align-h="between">
      <b-col
        cols="6"
        sm="6"
        lg="3"
        md="3"
        xl="3"
        class="mb-xl-5 mb-lg-5 mb-md-3 mb-sm-2 mb-2"
        @click="$router.go(-1)"
      >
        <div class="fakeButton">
          Înapoi
        </div>
      </b-col>
      <b-col
        cols="6"
        sm="6"
        lg="3"
        md="3"
        xl="3"
        class="mb-xl-5 mb-lg-5 mb-md-3 mb-sm-2 mb-2"
      >
        <router-link :to="ROUTES.HOME.path">
          <div class="fakeButton">
            Acasă
          </div>
        </router-link>
      </b-col>
      <b-col
        cols="6"
        sm="6"
        lg="3"
        md="3"
        xl="3"
        class="mb-xl-5 mb-lg-5 mb-md-3 mb-sm-2 mb-2"
      >
        <div class="fakeButton">
          .PDF
        </div>
      </b-col>
      <b-col
        cols="6"
        sm="6"
        lg="3"
        md="3"
        xl="2"
        class="mb-xl-5 mb-lg-5 mb-md-3 mb-sm-2 mb-2"
      >
        <div class="fakeButton " @click="makeFav()">
          <i
            class="fas fa-star star"
            :class="star || fav ? 'starButton' : 'noStarButton'"
          ></i>
        </div>
      </b-col>
    </b-row>
    <div class="scheduleTitle">
      <h3 v-if="SCHEDULE.length > 0 && mode === 'grupa'">
        {{ SELECTED_SEMIGROUP }}
      </h3>
      <h3 v-if="SCHEDULE.length > 0 && mode === 'prof'">
        {{ SCHEDULE[0].teachingDegreeName }}
        {{ SCHEDULE[0].doctoralSituationsName }}
        {{ SCHEDULE[0].activityTypesName }} {{ SCHEDULE[0].teacherLastName }}
        {{ SCHEDULE[0].teacherFirstName }}
      </h3>
    </div>
    <table class="scheduleTable">
      <tbody>
        <tr class="day">
          <td></td>
          <td
            v-for="day in days"
            :key="day.dID"
            class="headDay"
            :class="day.dId != dayToShow && windowWidth < 768 ? 'blur' : ''"
          >
            {{ day.name }}
          </td>
        </tr>
        <tr v-for="hour in hours" :key="hour.hId" class="hour">
          <td class="interval" v-html="hour.name"></td>
          <template v-for="day in days">
            <CourseComponent
              :key="day.dId"
              :courses="Courses(day.dId, hour.hId)"
              v-if="!rowSpan(day.dId, hour.hId)"
              class="bodyDay"
              :class="day.dId != dayToShow && windowWidth < 768 ? 'blur' : ''"
            >
            </CourseComponent>
          </template>
        </tr>

        <!-- <tr class="legends">
          <td v-for="day in days.length + 1" :key="day.dID">-</td>
        </tr> -->

        <tr class="legends">
          <td style="border: none;">Legendă:</td>
          <td style="background-color:#ccbbbb">seminar</td>
          <td style="background-color:#ccddcc">laborator</td>
          <td style="background-color:#eeeeee">consultații</td>
          <td style="background-color:#ccddcc">proiect</td>
          <td style="background-color:#9999aa">curs</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
// vue
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import {
  SCHEDULE,
  WEEKEND,
  SELECTED_TEACHER,
  SELECTED_SEMIGROUP,
} from '@/store/modules/main/getters';
import CourseComponent from '@/components/Schedule/Course.component.vue';
import { ROUTES } from '@/constants';
import {
  GET_SCHEDULE_ACTION,
  RESET_SCHEDULE_ACTION,
} from '../../store/modules/main/actions';
import { teachers } from '../../services/API.endpoints';

// component setup
@Component({
  components: {
    CourseComponent,
  },
  computed: mapGetters({
    SCHEDULE,
    WEEKEND,
    SELECTED_TEACHER,
    SELECTED_SEMIGROUP,
  }),
})
export default class ScheduleComponent extends Vue {
  // private
  private countLine = 0;
  private readonly ROUTES: {} = ROUTES;
  private fav = false;
  private days = [
    {
      dId: 1,
      name: 'Luni',
    },
    {
      dId: 2,
      name: 'Marți',
    },
    {
      dId: 3,
      name: 'Miercuri',
    },
    {
      dId: 4,
      name: 'Joi',
    },
    {
      dId: 5,
      name: 'Vineri',
    },
    {
      dId: 6,
      name: 'Sâmbătă',
    },
    {
      dId: 7,
      name: 'Duminică',
    },
  ];
  private hours = [
    {
      hId: 480,
      name: '8<sup>00</sup>-9<sup>00</sup>',
    },
    {
      hId: 540,
      name: '9<sup>00</sup>-10<sup>00</sup>',
    },
    {
      hId: 600,
      name: '10<sup>00</sup>-11<sup>00</sup>',
    },
    {
      hId: 660,
      name: '11<sup>00</sup>-12<sup>00</sup>',
    },
    {
      hId: 720,
      name: '12<sup>00</sup>-13<sup>00</sup>',
    },
    {
      hId: 780,
      name: '13<sup>00</sup>-14<sup>00</sup>',
    },
    {
      hId: 840,
      name: '14<sup>00</sup>-15<sup>00</sup>',
    },
    {
      hId: 900,
      name: '15<sup>00</sup>-16<sup>00</sup>',
    },
    {
      hId: 960,
      name: '16<sup>00</sup>-17<sup>00</sup>',
    },
    {
      hId: 1020,
      name: '17<sup>00</sup>-18<sup>00</sup>',
    },
    {
      hId: 1080,
      name: '18<sup>00</sup>-19<sup>00</sup>',
    },
    {
      hId: 1140,
      name: '19<sup>00</sup>-20<sup>00</sup>',
    },
    {
      hId: 1200,
      name: '20<sup>00</sup>-21<sup>00</sup>',
    },
    {
      hId: 1260,
      name: '21<sup>00</sup>-22<sup>00</sup>',
    },
  ];
  private COURSES: any = [];
  private dayToShow = 1;
  private windowWidth = 99999;
  private touch: any = {
    startX: 0,
    endX: 0,
  };
  private mode: any = '';
  private id: any = 0;
  constructor() {
    super();
  }
  private async created() {
    this.windowWidth = window.innerWidth;
    this.mode = this.$route.query.mode;
    this.id = this.$route.query.id;
    // this.dayToShow = 1;
    await this.$store.dispatch(GET_SCHEDULE_ACTION, {
      id: this.id,
      mode: this.mode,
    });
    // document.title = this.$store.getters[SCHEDULE][0].teacherLastName;
    this.days = this.$store.getters[WEEKEND]
      ? this.days
      : this.days.slice(0, this.days.length - 2);
    const today = new Date().getDay();
    this.dayToShow = today > this.days.length ? 1 : today;
    // console.log(this.$store.getters[SCHEDULE]);
    this.$el.addEventListener('touchstart', (event: any) =>
      this.touchstart(event),
    );
    this.$el.addEventListener('touchmove', (event: any) =>
      this.touchmove(event),
    );
    this.$el.addEventListener('touchend', () => this.touchend());
  }
  get Courses() {
    return (day: any, hour: any) => {
      return this.$store.getters[SCHEDULE].filter(
        (c: any) => c.courseDayNumber === day && c.courseStartHour === hour,
      );
    };
  }
  get rowSpan() {
    return (day: any, hour: any) => {
      return (
        this.$store.getters[SCHEDULE].filter(
          (c: any) =>
            c.courseDayNumber === day &&
            c.courseStartHour + c.courseDuration > hour &&
            c.courseStartHour < hour,
        ).length > 0
      );
    };
  }
  private mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  }
  get listPosition() {
    return this.windowWidth <= 768
      ? { transform: 'translateX(-' + (this.dayToShow - 1) * 100 + '%)' }
      : '';
  }
  get listLength() {
    return this.windowWidth <= 768
      ? { width: (this.days.length + 0) * 100 + '%' }
      : '';
  }
  private async beforeDestroy() {
    this.$store.dispatch(RESET_SCHEDULE_ACTION);
  }
  private touchstart(event: any) {
    this.touch.startX = event.touches[0].clientX;
    this.touch.endX = 0;
  }
  private touchmove(event: any) {
    this.touch.endX = event.touches[0].clientX;
  }
  private touchend() {
    if (
      !this.touch.endX ||
      Math.abs(this.touch.endX - this.touch.startX) < 50
    ) {
      return;
    }

    if (this.touch.endX < this.touch.startX) {
      this.dayToShow < this.days.length
        ? this.dayToShow++
        : (this.dayToShow = 1);
    } else {
      this.dayToShow > 1
        ? this.dayToShow--
        : (this.dayToShow = this.days.length);
    }
  }
  private makeFav() {
    const object = {
      id: this.id,
      mode: this.mode.toString(),
      name: this.getName(),
    };
    let newArray: any[] = [];
    const local = localStorage.getItem('Favorites');
    if (local === null || local.length === 2) {
      newArray.push(object);
      this.fav = true;
    } else {
      const favList = JSON.parse(local);
      newArray = favList.filter((item: any) => {
        return !(!(item.id !== object.id) && !(item.mode !== object.mode));
      });
      if (favList.length === newArray.length) {
        newArray.push(object);
        this.fav = true;
      } else {
        this.fav = false;
      }
    }
    localStorage.setItem('Favorites', JSON.stringify(newArray));
  }
  private getName() {
    const teacher = this.$store.getters[SELECTED_TEACHER] || 'test';
    const group = this.$store.getters[SELECTED_SEMIGROUP];
    console.log(teacher, group);

    return group.length > 0 ? group : teacher;
  }
  get star() {
    const object = {
      id: this.id,
      mode: this.mode.toString(),
      name: this.getName(),
    };
    const local = localStorage.getItem('Favorites') || '[{}]';
    const favList = JSON.parse(local);
    return favList.find(
      (item: any) => item.id === object.id && item.mode === object.mode,
    )
      ? true
      : false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_schedule.scss';
</style>

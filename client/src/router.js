import Vue from "vue";
import Router from "vue-router";

import Index from "./views/User/Index";
import UserRegister from "./views/User/Register";
import notFound from "./views/404";
import UserLogin from "./views/User/Login";
import Home from "./views/User/Home";
import InfoShow from "./views/User/InfoShow";
import CurrentBorrowingRenewing from "./views/User/CurrentBorrowingRenewing";
import BorrowedHistory from "./views/User/BorrowedHistory";
import BookReservationManagement from "./views/User/BookReservationManagement";
import ChangePassword from "./views/User/ChangePassword";
import OverdueInquiry from "./views/User/OverdueInquiry";
import CompensationInquiry from "./views/User/CompensationInquiry";
import UpdateUser from "./views/User/UpdateUser";

import Register from "./views/Staff/Register";
import Login from "./views/Staff/Login";
import StaffIndex from "./views/Staff/Index";
import BorrowingBook from "./views/Staff/BorrowingBook";
import BookReturn from "./views/Staff/BookReturn";
import Library from "./views/library";
import bookSearch from "./views/bookSearch";
import NewBookStorage from "./views/Staff/NewBookStorage";
import ChangePassword2 from "./views/Staff/ChangePassword";
import InfoShow2 from "./views/Staff/InfoShow";
import UpdateStaff from "./views/Staff/UpdateStaff";
import ResetReaderPassword from "./views/Staff/ResetReaderPassword";
import ReaderRegistration from "./views/Staff/ReaderRegistration";
import DeleteReader from "./views/Staff/DeleteReader";
import ViewReaderInformation from "./views/Staff/ViewReaderInformation";
import ViewReader from "./views/Staff/ViewReader";
import Loss from "./views/Staff/Loss";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/index"
    },
    {
      path: "/library",
      name: "Library",
      component: Library
    },
    { path: "/bookSearch", name: "bookSearch", component: bookSearch },
    {
      path: "/index",
      component: Index,
      children: [
        { path: "", component: Home },
        { path: "/home", name: "home", component: Home },
        { path: "/infoshow", name: "infoshow", component: InfoShow },
        { path: "/updateUser", name: "UpdateUser", component: UpdateUser },
        {
          path: "/currentBorrowingRenewing",
          name: "CurrentBorrowingRenewing",
          component: CurrentBorrowingRenewing
        },
        {
          path: "/borrowedHistory",
          name: "BorrowedHistory",
          component: BorrowedHistory
        },
        {
          path: "/bookReservationManagement",
          name: "BookReservationManagement",
          component: BookReservationManagement
        },
        {
          path: "/changePassword",
          name: "ChangePassword",
          component: ChangePassword
        },
        {
          path: "/overdueInquiry",
          name: "OverdueInquiry",
          component: OverdueInquiry
        },
        {
          path: "/compensationInquiry",
          name: "CompensationInquiry",
          component: CompensationInquiry
        }
      ]
    },
    {
      path: "/user/register",
      name: "userRegister",
      component: UserRegister
    },
    {
      path: "/user/login",
      name: "userLogin",
      component: UserLogin
    },
    {
      path: "/staff",
      component: StaffIndex,
      children: [
        {
          path: "borrowingBook",
          name: "BorrowingBook",
          component: BorrowingBook
        },
        {
          path: "bookReturn",
          name: "BookReturn",
          component: BookReturn
        },
        {
          path: "newBookStorage",
          name: "newBookStorage",
          component: NewBookStorage
        },
        {
          path: "changePassword2",
          name: "ChangePassword2",
          component: ChangePassword2
        },
        { path: "infoshow2", name: "infoshow2", component: InfoShow2 },
        { path: "updateStaff", name: "UpdateStaff", component: UpdateStaff },
        {
          path: "resetReaderPassword",
          name: "resetReaderPassword",
          component: ResetReaderPassword
        },
        {
          path: "readerRegistration",
          name: "readerRegistration",
          component: ReaderRegistration
        },
        {
          path: "deleteReader",
          name: "deleteReader",
          component: DeleteReader
        },
        {
          path: "viewReader",
          name: "viewReader",
          component: ViewReader
        },
        {
          path: "viewReaderInformation",
          name: "viewReaderInformation",
          component: ViewReaderInformation
        },
        {
          path: "loss",
          name: "loss",
          component: Loss
        }
      ]
    },
    {
      path: "/staff/register",
      name: "register",
      component: Register
    },
    {
      path: "/staff/login",
      name: "login",
      component: Login
    },
    {
      path: "*",
      name: "/404",
      component: notFound
    }
  ]
});

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.eleToken;
  if (
    to.path === "/user/login" ||
    to.path === "/user/register" ||
    to.path === "/staff/login" ||
    to.path === "/staff/register" ||
    to.path === "/library" ||
    to.path === "/bookSearch"
  ) {
    next();
  } else {
    isLogin
      ? next()
      : to.path.includes("staff")
      ? next("/staff/login")
      : next("/user/login");
  }
});

export default router;

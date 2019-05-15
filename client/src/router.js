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
import BookInfo from "./views/BookInfo";
import TreeSearch from "./views/TreeSearch";
import BookInformationEditing from "./views/Staff/BookInformationEditing";
import ModificationOfTheCollection from "./views/Staff/ModificationOfTheCollection";
import BookCompensation from "./views/Staff/BookCompensation";
import AdminLogin from "./views/Admin/Login";
import AdminIndex from "./views/Admin/Index";
import Punish from "./views/Staff/Punish";
import StaffRegistration from "./views/Admin/StaffRegistration";
import DeleteStaff from "./views/Admin/DeleteStaff";
import StaffChange from "./views/Admin/StaffChange";
import ChangePassword3 from "./views/Admin/ChangePassword"
import InformationDevelopment from "./views/Admin/InformationDevelopment";
import InformationModification from "./views/Admin/InformationModification";
import libraryInfo from "./views/libraryInfo";
import libraryInfoList from "./views/libraryInfoList";
import SSS from "./views/Staff/SSS";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/library"
    },
    {
      path: "/library",
      name: "Library",
      component: Library
    },
    { path: "/library/bookSearch", name: "bookSearch", component: bookSearch },
    { path: "/library/bookInfo", name: "bookInfo", component: BookInfo },
    {
      path: "/library/classifySearch",
      name: "classifySearch",
      component: TreeSearch
    },
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
          path: "bookInformationEditing",
          name: "bookInformationEditing",
          component: BookInformationEditing
        },
        {
          path: "modificationOfTheCollection",
          name: "modificationOfTheCollection",
          component: ModificationOfTheCollection
        },
        {
          path: "bookCompensation",
          name: "bookCompensation",
          component: BookCompensation
        },
        {
          path: "punish",
          name: "punish",
          component: Punish
        },
        {
          path: "loss",
          name: "loss",
          component: Loss
        },
      ]
    },
    {
      path: "/admin",
      component: AdminIndex,
      children: [
        { path: "staffRegistration", name: "staffRegistration", component: StaffRegistration },
        { path: "deleteStaff", name: "deleteStaff", component: DeleteStaff },
        { path: "staffChange", name: "staffChange", component: StaffChange },
        { path: "informationDevelopment", name: "informationDevelopment", component: InformationDevelopment },
        { path: "informationModification", name: "informationModification", component: InformationModification },
        { path: "changePassword", name: "changePassword", component: ChangePassword3 },
      ]
    },
    {
      path: "/admin/login",
      name: "adminLogin",
      component: AdminLogin
    },
    {
      path: "/staff/register",
      name: "register",
      component: Register
    },
    {
      path: "/library/infoList",
      name: "infoList",
      component: libraryInfoList
    },
    {
      path: "/library/info",
      name: "info",
      component: libraryInfo
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
    },
    {
      path:'/file',
      name:'file',
      component:SSS
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
      to.path === "/admin/login" ||
    to.path === "/staff/register" ||to.path === "/file" ||
    to.path.includes("library")
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

USE [master]
GO
/****** Object:  Database [Raspored]    Script Date: 24-Apr-16 7:44:16 PM ******/
CREATE DATABASE [Raspored]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Raspored', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Raspored.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Raspored_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Raspored_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Raspored] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Raspored].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Raspored] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Raspored] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Raspored] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Raspored] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Raspored] SET ARITHABORT OFF 
GO
ALTER DATABASE [Raspored] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Raspored] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Raspored] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Raspored] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Raspored] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Raspored] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Raspored] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Raspored] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Raspored] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Raspored] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Raspored] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Raspored] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Raspored] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Raspored] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Raspored] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Raspored] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Raspored] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Raspored] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Raspored] SET  MULTI_USER 
GO
ALTER DATABASE [Raspored] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Raspored] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Raspored] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Raspored] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [Raspored] SET DELAYED_DURABILITY = DISABLED 
GO
USE [Raspored]
GO
/****** Object:  Table [dbo].[Activities]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activities](
	[activityID] [int] IDENTITY(1,1) NOT NULL,
	[timeSpanID] [int] NOT NULL,
	[place] [nvarchar](50) NULL,
	[classroomID] [int] NULL,
	[title] [nvarchar](50) NOT NULL,
	[activityContent] [nvarchar](2000) NULL,
	[studentID] [int] NULL,
	[groupID] [int] NULL,
	[activityScheduleID] [int] NULL,
 CONSTRAINT [PK_Activities] PRIMARY KEY CLUSTERED 
(
	[activityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ActivitySchedules]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivitySchedules](
	[activityScheduleID] [int] IDENTITY(1,1) NOT NULL,
	[semester] [nvarchar](50) NOT NULL,
	[beginning] [date] NOT NULL,
	[ending] [date] NOT NULL,
	[link] [nvarchar](200) NULL,
 CONSTRAINT [PK_RasporedAktivnosti] PRIMARY KEY CLUSTERED 
(
	[activityScheduleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Ads]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ads](
	[adID] [int] IDENTITY(1,1) NOT NULL,
	[studentID] [int] NOT NULL,
	[divisionID] [int] NOT NULL,
 CONSTRAINT [PK_Oglas] PRIMARY KEY CLUSTERED 
(
	[adID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AssistantsCourses]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AssistantsCourses](
	[assistantCourseID] [int] IDENTITY(1,1) NOT NULL,
	[assistantID] [int] NOT NULL,
	[courseID] [int] NOT NULL,
	[classType] [nvarchar](50) NULL,
 CONSTRAINT [PK_AssistantsCourses] PRIMARY KEY CLUSTERED 
(
	[assistantCourseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Classrooms]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Classrooms](
	[classroomID] [int] IDENTITY(1,1) NOT NULL,
	[number] [int] NOT NULL,
	[projector] [bit] NOT NULL,
	[sunnySide] [bit] NOT NULL,
 CONSTRAINT [PK_Ucionica] PRIMARY KEY CLUSTERED 
(
	[classroomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Courses]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[courseID] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NOT NULL,
	[alias] [nvarchar](50) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Predmet] PRIMARY KEY CLUSTERED 
(
	[courseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Departments]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[departmentID] [int] IDENTITY(1,1) NOT NULL,
	[departmentName] [nvarchar](50) NOT NULL,
	[year] [int] NOT NULL,
 CONSTRAINT [PK_Smer] PRIMARY KEY CLUSTERED 
(
	[departmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Divisions]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Divisions](
	[divisionID] [int] IDENTITY(1,1) NOT NULL,
	[creatorID] [int] NOT NULL,
	[divisionTypeID] [int] NOT NULL,
	[beginning] [date] NOT NULL,
	[ending] [date] NOT NULL,
 CONSTRAINT [PK_Raspodela] PRIMARY KEY CLUSTERED 
(
	[divisionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DivisionTypes]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DivisionTypes](
	[divisionTypeID] [int] IDENTITY(1,1) NOT NULL,
	[type] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_TipRaspodele] PRIMARY KEY CLUSTERED 
(
	[divisionTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Groups]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[groupID] [int] IDENTITY(1,1) NOT NULL,
	[classroomID] [int] NOT NULL,
	[divisionID] [int] NOT NULL,
	[timeSpanID] [int] NOT NULL,
 CONSTRAINT [PK_Grupa] PRIMARY KEY CLUSTERED 
(
	[groupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GroupsAssistants]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupsAssistants](
	[groupsAssistantID] [int] IDENTITY(1,1) NOT NULL,
	[groupID] [int] NOT NULL,
	[assistantID] [int] NOT NULL,
 CONSTRAINT [PK_GroupsAssistants] PRIMARY KEY CLUSTERED 
(
	[groupsAssistantID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GroupsStudents]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupsStudents](
	[groupsStudentID] [int] IDENTITY(1,1) NOT NULL,
	[groupID] [int] NOT NULL,
	[studentID] [int] NOT NULL,
 CONSTRAINT [PK_GrupaStudent] PRIMARY KEY CLUSTERED 
(
	[groupsStudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Periods]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Periods](
	[periodID] [int] IDENTITY(1,1) NOT NULL,
	[adID] [int] NOT NULL,
	[groupID] [int] NOT NULL,
 CONSTRAINT [PK_ZeljeniTermin] PRIMARY KEY CLUSTERED 
(
	[periodID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permissions](
	[permissionID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Permisija] PRIMARY KEY CLUSTERED 
(
	[permissionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Roles]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[roleID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Rola] PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[RolesPermissions]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RolesPermissions](
	[rolesPermissionID] [int] IDENTITY(1,1) NOT NULL,
	[roleID] [int] NOT NULL,
	[permissionID] [int] NOT NULL,
 CONSTRAINT [PK_RolaPermisija] PRIMARY KEY CLUSTERED 
(
	[rolesPermissionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Students]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[studentID] [int] IDENTITY(1,1) NOT NULL,
	[deparmentID] [int] NOT NULL,
	[indexNumber] [int] NOT NULL,
 CONSTRAINT [PK_Student] PRIMARY KEY CLUSTERED 
(
	[studentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[StudentsActivities]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentsActivities](
	[studentActivityID] [int] IDENTITY(1,1) NOT NULL,
	[studentID] [int] NOT NULL,
	[activityID] [int] NOT NULL,
	[ignore] [bit] NULL,
	[alert] [bit] NULL,
 CONSTRAINT [PK_StudentsActivities] PRIMARY KEY CLUSTERED 
(
	[studentActivityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TimeSpans]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TimeSpans](
	[timeSpanID] [int] IDENTITY(1,1) NOT NULL,
	[startDate] [datetime] NOT NULL,
	[endDate] [datetime] NOT NULL,
	[period] [int] NULL,
 CONSTRAINT [PK_TimeSpans] PRIMARY KEY CLUSTERED 
(
	[timeSpanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UniMembers]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UniMembers](
	[uniMemberID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[surname] [nvarchar](50) NOT NULL,
	[address] [nvarchar](200) NULL,
	[username] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[studentID] [int] NULL,
 CONSTRAINT [PK_ClanFakulteta_1] PRIMARY KEY CLUSTERED 
(
	[uniMemberID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UniMembersRoles]    Script Date: 24-Apr-16 7:44:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UniMembersRoles](
	[uniMembersRoleID] [int] IDENTITY(1,1) NOT NULL,
	[uniMemberID] [int] NOT NULL,
	[roleID] [int] NOT NULL,
 CONSTRAINT [PK_ClanFakultetaRola] PRIMARY KEY CLUSTERED 
(
	[uniMembersRoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[Departments] ON 

INSERT [dbo].[Departments] ([departmentID], [departmentName], [year]) VALUES (1, N'Računarstvo i informatika', 3)
INSERT [dbo].[Departments] ([departmentID], [departmentName], [year]) VALUES (2, N'Računarstvo i informatika', 4)
INSERT [dbo].[Departments] ([departmentID], [departmentName], [year]) VALUES (3, N'Računarstvo i informatika', 2)
INSERT [dbo].[Departments] ([departmentID], [departmentName], [year]) VALUES (4, N'Računarstvo i informatika', 5)
SET IDENTITY_INSERT [dbo].[Departments] OFF
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([roleID], [name]) VALUES (1, N'prva')
INSERT [dbo].[Roles] ([roleID], [name]) VALUES (2, N'druga')
INSERT [dbo].[Roles] ([roleID], [name]) VALUES (3, N'treca')
INSERT [dbo].[Roles] ([roleID], [name]) VALUES (4, N'osma')
INSERT [dbo].[Roles] ([roleID], [name]) VALUES (5, N'novi')
SET IDENTITY_INSERT [dbo].[Roles] OFF
ALTER TABLE [dbo].[Activities]  WITH CHECK ADD  CONSTRAINT [FK_Activities_ActivitySchedules] FOREIGN KEY([activityScheduleID])
REFERENCES [dbo].[ActivitySchedules] ([activityScheduleID])
GO
ALTER TABLE [dbo].[Activities] CHECK CONSTRAINT [FK_Activities_ActivitySchedules]
GO
ALTER TABLE [dbo].[Activities]  WITH CHECK ADD  CONSTRAINT [FK_Activities_Classrooms] FOREIGN KEY([classroomID])
REFERENCES [dbo].[Classrooms] ([classroomID])
GO
ALTER TABLE [dbo].[Activities] CHECK CONSTRAINT [FK_Activities_Classrooms]
GO
ALTER TABLE [dbo].[Activities]  WITH CHECK ADD  CONSTRAINT [FK_Activities_Groups] FOREIGN KEY([groupID])
REFERENCES [dbo].[Groups] ([groupID])
GO
ALTER TABLE [dbo].[Activities] CHECK CONSTRAINT [FK_Activities_Groups]
GO
ALTER TABLE [dbo].[Activities]  WITH CHECK ADD  CONSTRAINT [FK_Activities_Students] FOREIGN KEY([studentID])
REFERENCES [dbo].[Students] ([studentID])
GO
ALTER TABLE [dbo].[Activities] CHECK CONSTRAINT [FK_Activities_Students]
GO
ALTER TABLE [dbo].[Activities]  WITH CHECK ADD  CONSTRAINT [FK_Activities_TimeSpans] FOREIGN KEY([timeSpanID])
REFERENCES [dbo].[TimeSpans] ([timeSpanID])
GO
ALTER TABLE [dbo].[Activities] CHECK CONSTRAINT [FK_Activities_TimeSpans]
GO
ALTER TABLE [dbo].[Ads]  WITH CHECK ADD  CONSTRAINT [FK_Oglas_Raspodela] FOREIGN KEY([divisionID])
REFERENCES [dbo].[Divisions] ([divisionID])
GO
ALTER TABLE [dbo].[Ads] CHECK CONSTRAINT [FK_Oglas_Raspodela]
GO
ALTER TABLE [dbo].[Ads]  WITH CHECK ADD  CONSTRAINT [FK_Oglas_Student] FOREIGN KEY([studentID])
REFERENCES [dbo].[Students] ([studentID])
GO
ALTER TABLE [dbo].[Ads] CHECK CONSTRAINT [FK_Oglas_Student]
GO
ALTER TABLE [dbo].[AssistantsCourses]  WITH CHECK ADD  CONSTRAINT [FK_AssistantsCourses_Courses] FOREIGN KEY([courseID])
REFERENCES [dbo].[Courses] ([courseID])
GO
ALTER TABLE [dbo].[AssistantsCourses] CHECK CONSTRAINT [FK_AssistantsCourses_Courses]
GO
ALTER TABLE [dbo].[AssistantsCourses]  WITH CHECK ADD  CONSTRAINT [FK_AssistantsCourses_UniMembers] FOREIGN KEY([assistantID])
REFERENCES [dbo].[UniMembers] ([uniMemberID])
GO
ALTER TABLE [dbo].[AssistantsCourses] CHECK CONSTRAINT [FK_AssistantsCourses_UniMembers]
GO
ALTER TABLE [dbo].[Divisions]  WITH CHECK ADD  CONSTRAINT [FK_Raspodela_TipRaspodele] FOREIGN KEY([divisionTypeID])
REFERENCES [dbo].[DivisionTypes] ([divisionTypeID])
GO
ALTER TABLE [dbo].[Divisions] CHECK CONSTRAINT [FK_Raspodela_TipRaspodele]
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD  CONSTRAINT [FK_Groups_TimeSpans] FOREIGN KEY([timeSpanID])
REFERENCES [dbo].[TimeSpans] ([timeSpanID])
GO
ALTER TABLE [dbo].[Groups] CHECK CONSTRAINT [FK_Groups_TimeSpans]
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD  CONSTRAINT [FK_Grupa_Raspodela] FOREIGN KEY([divisionID])
REFERENCES [dbo].[Divisions] ([divisionID])
GO
ALTER TABLE [dbo].[Groups] CHECK CONSTRAINT [FK_Grupa_Raspodela]
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD  CONSTRAINT [FK_Grupa_Ucionica] FOREIGN KEY([classroomID])
REFERENCES [dbo].[Classrooms] ([classroomID])
GO
ALTER TABLE [dbo].[Groups] CHECK CONSTRAINT [FK_Grupa_Ucionica]
GO
ALTER TABLE [dbo].[GroupsAssistants]  WITH CHECK ADD  CONSTRAINT [FK_GroupsAssistants_Groups] FOREIGN KEY([groupID])
REFERENCES [dbo].[Groups] ([groupID])
GO
ALTER TABLE [dbo].[GroupsAssistants] CHECK CONSTRAINT [FK_GroupsAssistants_Groups]
GO
ALTER TABLE [dbo].[GroupsAssistants]  WITH CHECK ADD  CONSTRAINT [FK_GroupsAssistants_UniMembers] FOREIGN KEY([assistantID])
REFERENCES [dbo].[UniMembers] ([uniMemberID])
GO
ALTER TABLE [dbo].[GroupsAssistants] CHECK CONSTRAINT [FK_GroupsAssistants_UniMembers]
GO
ALTER TABLE [dbo].[GroupsStudents]  WITH CHECK ADD  CONSTRAINT [FK_GrupaStudent_Grupa] FOREIGN KEY([groupID])
REFERENCES [dbo].[Groups] ([groupID])
GO
ALTER TABLE [dbo].[GroupsStudents] CHECK CONSTRAINT [FK_GrupaStudent_Grupa]
GO
ALTER TABLE [dbo].[GroupsStudents]  WITH CHECK ADD  CONSTRAINT [FK_GrupaStudent_Student] FOREIGN KEY([studentID])
REFERENCES [dbo].[Students] ([studentID])
GO
ALTER TABLE [dbo].[GroupsStudents] CHECK CONSTRAINT [FK_GrupaStudent_Student]
GO
ALTER TABLE [dbo].[Periods]  WITH CHECK ADD  CONSTRAINT [FK_ZeljeniTermin_Grupa] FOREIGN KEY([groupID])
REFERENCES [dbo].[Groups] ([groupID])
GO
ALTER TABLE [dbo].[Periods] CHECK CONSTRAINT [FK_ZeljeniTermin_Grupa]
GO
ALTER TABLE [dbo].[Periods]  WITH CHECK ADD  CONSTRAINT [FK_ZeljeniTermin_Oglas] FOREIGN KEY([adID])
REFERENCES [dbo].[Ads] ([adID])
GO
ALTER TABLE [dbo].[Periods] CHECK CONSTRAINT [FK_ZeljeniTermin_Oglas]
GO
ALTER TABLE [dbo].[RolesPermissions]  WITH CHECK ADD  CONSTRAINT [FK_RolaPermisija_Permisija] FOREIGN KEY([permissionID])
REFERENCES [dbo].[Permissions] ([permissionID])
GO
ALTER TABLE [dbo].[RolesPermissions] CHECK CONSTRAINT [FK_RolaPermisija_Permisija]
GO
ALTER TABLE [dbo].[RolesPermissions]  WITH CHECK ADD  CONSTRAINT [FK_RolaPermisija_Rola] FOREIGN KEY([roleID])
REFERENCES [dbo].[Roles] ([roleID])
GO
ALTER TABLE [dbo].[RolesPermissions] CHECK CONSTRAINT [FK_RolaPermisija_Rola]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Student_Smer] FOREIGN KEY([deparmentID])
REFERENCES [dbo].[Departments] ([departmentID])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Student_Smer]
GO
ALTER TABLE [dbo].[StudentsActivities]  WITH CHECK ADD  CONSTRAINT [FK_StudentsActivities_Activities] FOREIGN KEY([activityID])
REFERENCES [dbo].[Activities] ([activityID])
GO
ALTER TABLE [dbo].[StudentsActivities] CHECK CONSTRAINT [FK_StudentsActivities_Activities]
GO
ALTER TABLE [dbo].[StudentsActivities]  WITH CHECK ADD  CONSTRAINT [FK_StudentsActivities_Students] FOREIGN KEY([studentID])
REFERENCES [dbo].[Students] ([studentID])
GO
ALTER TABLE [dbo].[StudentsActivities] CHECK CONSTRAINT [FK_StudentsActivities_Students]
GO
ALTER TABLE [dbo].[UniMembers]  WITH CHECK ADD  CONSTRAINT [FK_ClanFakulteta_ClanFakultetaRola] FOREIGN KEY([uniMemberID])
REFERENCES [dbo].[UniMembersRoles] ([uniMembersRoleID])
GO
ALTER TABLE [dbo].[UniMembers] CHECK CONSTRAINT [FK_ClanFakulteta_ClanFakultetaRola]
GO
ALTER TABLE [dbo].[UniMembers]  WITH CHECK ADD  CONSTRAINT [FK_ClanFakulteta_Student] FOREIGN KEY([studentID])
REFERENCES [dbo].[Students] ([studentID])
GO
ALTER TABLE [dbo].[UniMembers] CHECK CONSTRAINT [FK_ClanFakulteta_Student]
GO
ALTER TABLE [dbo].[UniMembersRoles]  WITH CHECK ADD  CONSTRAINT [FK_ClanFakultetaRola_Rola] FOREIGN KEY([roleID])
REFERENCES [dbo].[Roles] ([roleID])
GO
ALTER TABLE [dbo].[UniMembersRoles] CHECK CONSTRAINT [FK_ClanFakultetaRola_Rola]
GO
USE [master]
GO
ALTER DATABASE [Raspored] SET  READ_WRITE 
GO

using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;

namespace WebApplication1.Models
{
    public partial class RasporedContext : DbContext
    {
        //protected override void OnConfiguring(DbContextOptionsBuilder options)
        //{
        //    options.UseSqlServer(@"Server=MASA-PC\SQLEXPRESS;Database=Raspored;Trusted_Connection=True;");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activities>(entity =>
            {
                entity.HasKey(e => e.activityID);

                entity.Property(e => e.activityContent).HasMaxLength(2000);

                entity.Property(e => e.place).HasMaxLength(50);

                entity.Property(e => e.title)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.activitySchedule).WithMany(p => p.Activities).HasForeignKey(d => d.activityScheduleID);

                entity.HasOne(d => d.classroom).WithMany(p => p.Activities).HasForeignKey(d => d.classroomID);

                entity.HasOne(d => d.group).WithMany(p => p.Activities).HasForeignKey(d => d.groupID);

                entity.HasOne(d => d.student).WithMany(p => p.Activities).HasForeignKey(d => d.studentID);

                entity.HasOne(d => d.timeSpan).WithMany(p => p.Activities).HasForeignKey(d => d.timeSpanID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ActivitySchedules>(entity =>
            {
                entity.HasKey(e => e.activityScheduleID);

                entity.Property(e => e.beginning).HasColumnType("date");

                entity.Property(e => e.ending).HasColumnType("date");

                entity.Property(e => e.link).HasMaxLength(200);

                entity.Property(e => e.semester)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Ads>(entity =>
            {
                entity.HasKey(e => e.adID);

                entity.HasOne(d => d.division).WithMany(p => p.Ads).HasForeignKey(d => d.divisionID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.student).WithMany(p => p.Ads).HasForeignKey(d => d.studentID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AssistantsCourses>(entity =>
            {
                entity.HasKey(e => e.assistantCourseID);

                entity.Property(e => e.classType).HasMaxLength(50);

                entity.HasOne(d => d.assistant).WithMany(p => p.AssistantsCourses).HasForeignKey(d => d.assistantID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.course).WithMany(p => p.AssistantsCourses).HasForeignKey(d => d.courseID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Classrooms>(entity =>
            {
                entity.HasKey(e => e.classroomID);
            });

            modelBuilder.Entity<Courses>(entity =>
            {
                entity.HasKey(e => e.courseID);

                entity.Property(e => e.alias)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.code)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Departments>(entity =>
            {
                entity.HasKey(e => e.departmentID);

                entity.Property(e => e.departmentName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<DivisionTypes>(entity =>
            {
                entity.HasKey(e => e.divisionTypeID);

                entity.Property(e => e.type)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Divisions>(entity =>
            {
                entity.HasKey(e => e.divisionID);

                entity.Property(e => e.beginning).HasColumnType("date");

                entity.Property(e => e.ending).HasColumnType("date");

                entity.HasOne(d => d.divisionType).WithMany(p => p.Divisions).HasForeignKey(d => d.divisionTypeID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Groups>(entity =>
            {
                entity.HasKey(e => e.groupID);

                entity.HasOne(d => d.classroom).WithMany(p => p.Groups).HasForeignKey(d => d.classroomID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.division).WithMany(p => p.Groups).HasForeignKey(d => d.divisionID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.timeSpan).WithMany(p => p.Groups).HasForeignKey(d => d.timeSpanID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<GroupsAssistants>(entity =>
            {
                entity.HasKey(e => e.groupsAssistantID);

                entity.HasOne(d => d.assistant).WithMany(p => p.GroupsAssistants).HasForeignKey(d => d.assistantID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.group).WithMany(p => p.GroupsAssistants).HasForeignKey(d => d.groupID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<GroupsStudents>(entity =>
            {
                entity.HasKey(e => e.groupsStudentID);

                entity.HasOne(d => d.group).WithMany(p => p.GroupsStudents).HasForeignKey(d => d.groupID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.student).WithMany(p => p.GroupsStudents).HasForeignKey(d => d.studentID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Periods>(entity =>
            {
                entity.HasKey(e => e.periodID);

                entity.HasOne(d => d.ad).WithMany(p => p.Periods).HasForeignKey(d => d.adID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.group).WithMany(p => p.Periods).HasForeignKey(d => d.groupID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Permissions>(entity =>
            {
                entity.HasKey(e => e.permissionID);

                entity.Property(e => e.name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.roleID);

                entity.Property(e => e.name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<RolesPermissions>(entity =>
            {
                entity.HasKey(e => e.rolesPermissionID);

                entity.HasOne(d => d.permission).WithMany(p => p.RolesPermissions).HasForeignKey(d => d.permissionID).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.role).WithMany(p => p.RolesPermissions).HasForeignKey(d => d.roleID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Students>(entity =>
            {
                entity.HasKey(e => e.studentID);

                entity.HasOne(d => d.deparment).WithMany(p => p.Students).HasForeignKey(d => d.deparmentID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<TimeSpans>(entity =>
            {
                entity.HasKey(e => e.timeSpanID);

                entity.Property(e => e.endDate).HasColumnType("datetime");

                entity.Property(e => e.startDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<UniMembers>(entity =>
            {
                entity.HasKey(e => e.uniMemberID);

                entity.Property(e => e.uniMemberID).ValueGeneratedOnAdd();

                entity.Property(e => e.address).HasMaxLength(200);

                entity.Property(e => e.email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.password)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.surname)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.username)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.student).WithMany(p => p.UniMembers).HasForeignKey(d => d.studentID);

                entity.HasOne(d => d.uniMember).WithOne(p => p.UniMembers).HasForeignKey<UniMembers>(d => d.uniMemberID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<UniMembersRoles>(entity =>
            {
                entity.HasKey(e => e.uniMembersRoleID);

                entity.HasOne(d => d.role).WithMany(p => p.UniMembersRoles).HasForeignKey(d => d.roleID).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<sysdiagrams>(entity =>
            {
                entity.HasKey(e => e.diagram_id);

                entity.Property(e => e.definition).HasColumnType("varbinary");
            });
        }

        public virtual DbSet<Activities> Activities { get; set; }
        public virtual DbSet<ActivitySchedules> ActivitySchedules { get; set; }
        public virtual DbSet<Ads> Ads { get; set; }
        public virtual DbSet<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual DbSet<Classrooms> Classrooms { get; set; }
        public virtual DbSet<Courses> Courses { get; set; }
        public virtual DbSet<Departments> Departments { get; set; }
        public virtual DbSet<DivisionTypes> DivisionTypes { get; set; }
        public virtual DbSet<Divisions> Divisions { get; set; }
        public virtual DbSet<Groups> Groups { get; set; }
        public virtual DbSet<GroupsAssistants> GroupsAssistants { get; set; }
        public virtual DbSet<GroupsStudents> GroupsStudents { get; set; }
        public virtual DbSet<Periods> Periods { get; set; }
        public virtual DbSet<Permissions> Permissions { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<RolesPermissions> RolesPermissions { get; set; }
        public virtual DbSet<Students> Students { get; set; }
        public virtual DbSet<TimeSpans> TimeSpans { get; set; }
        public virtual DbSet<UniMembers> UniMembers { get; set; }
        public virtual DbSet<UniMembersRoles> UniMembersRoles { get; set; }
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
    }
}
using FakeXrmEasy;
using FakeXrmEasy.Extensions;
using Microsoft.Xrm.Sdk;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xrm.Oss.PowerKanban.Tests
{
    [TestFixture]
    public class CreateNotificationTests
    {
        [Test]
        public void It_Should_Create_Simple_Notification_On_Update()
        {
            var context = new XrmFakedContext();
            var service = context.GetOrganizationService();

            var userId = Guid.NewGuid();

            var incident = new Entity
            {
                LogicalName = "incident",
                Id = Guid.NewGuid(),
                ["description"] = "NaNaNaNaNaNaNaNa Batman",
                ["test"] = "This should be filtered out"
            };

            var subscription = new Entity
            {
                LogicalName = "oss_subscription",
                Id = Guid.NewGuid(),
                ["oss_incidentid"] = incident.ToEntityReference(),
                ["statecode"] = new OptionSetValue(0),
                ["ownerid"] = new EntityReference("systemuser", userId)
            };

            context.Initialize(new Entity[] { incident, subscription });

            var pluginCtx = context.GetDefaultPluginContext();

            pluginCtx.UserId = userId;
            pluginCtx.InputParameters = new ParameterCollection
            {
                ["Target"] = incident
            };
            pluginCtx.MessageName = "Update";

            var config = new CreateNotificationConfig
            {
                CapturedFields = new List<string> { "description" },
                NotificationLookupName = "oss_incidentid",
                NotifyCurrentUser = true,
                SubscriptionLookupName = "oss_incidentid"
            };

            Assert.That(() => context.ExecutePluginWithConfigurations<CreateNotification>(pluginCtx, JsonSerializer.Serialize(config), string.Empty), Throws.Nothing);

            Assert.That(context.Data, Contains.Key("oss_notification"));

            var notification = context.Data["oss_notification"].First().Value;
            
            Assert.That(notification.GetAttributeValue<EntityReference>("ownerid")?.Id, Is.EqualTo(userId));
            Assert.That(notification.GetAttributeValue<EntityReference>("oss_incidentid"), Is.EqualTo(incident.ToEntityReference()));

            var data = JsonDeserializer.Parse<EventData>(notification.GetAttributeValue<string>("oss_data"));

            Assert.That(data.EventRecordReference, Is.EqualTo(incident.ToEntityReference()));
            Assert.That(data.UpdatedFields, Is.EquivalentTo(new List<string> { "description" }));
        }

        [Test]
        public void It_Should_Create_Notification_On_Parent_On_Child_Create()
        {
            var context = new XrmFakedContext();
            var service = context.GetOrganizationService();

            var userId = Guid.NewGuid();

            var incident = new Entity
            {
                LogicalName = "incident",
                Id = Guid.NewGuid(),
                ["description"] = "NaNaNaNaNaNaNaNa Batman",
                ["test"] = "This should be filtered out"
            };

            var subscription = new Entity
            {
                LogicalName = "oss_subscription",
                Id = Guid.NewGuid(),
                ["oss_incidentid"] = incident.ToEntityReference(),
                ["statecode"] = new OptionSetValue(0),
                ["ownerid"] = new EntityReference("systemuser", userId)
            };

            var task = new Entity
            {
                LogicalName = "task",
                Id = Guid.NewGuid(),
                ["title"] = "Test",
                ["regardingobjectid"] = incident.ToEntityReference()
            };

            context.Initialize(new Entity[] { incident, subscription, task });

            var pluginCtx = context.GetDefaultPluginContext();

            pluginCtx.UserId = userId;
            pluginCtx.InputParameters = new ParameterCollection
            {
                ["Target"] = task
            };
            pluginCtx.MessageName = "Create";

            var config = new CreateNotificationConfig
            {
                CapturedFields = new List<string> { "title" },
                NotificationLookupName = "oss_incidentid",
                NotifyCurrentUser = true,
                SubscriptionLookupName = "oss_incidentid",
                ParentLookupName = "regardingobjectid"
            };

            Assert.That(() => context.ExecutePluginWithConfigurations<CreateNotification>(pluginCtx, JsonSerializer.Serialize(config), string.Empty), Throws.Nothing);

            Assert.That(context.Data, Contains.Key("oss_notification"));

            var notification = context.Data["oss_notification"].First().Value;

            Assert.That(notification.GetAttributeValue<EntityReference>("ownerid")?.Id, Is.EqualTo(userId));
            Assert.That(notification.GetAttributeValue<EntityReference>("oss_incidentid"), Is.EqualTo(incident.ToEntityReference()));

            var data = JsonDeserializer.Parse<EventData>(notification.GetAttributeValue<string>("oss_data"));

            Assert.That(data.EventRecordReference, Is.EqualTo(task.ToEntityReference()));
            Assert.That(data.UpdatedFields, Is.EquivalentTo(new List<string> { "title" }));
        }
    }
}
